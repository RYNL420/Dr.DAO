from flask import Blueprint, jsonify, request
from models.database import Recommendation, FutarchyPoll, Vote, TreasuryAsset, PerformanceMetric
from services.agent_service import DrDAOAgent
from datetime import datetime, timedelta

api_bp = Blueprint('api', __name__)
dr_dao = DrDAOAgent()

@api_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    recommendations = Recommendation.query.order_by(Recommendation.timestamp.desc()).all()
    return jsonify([{
        'id': rec.id,
        'recommendation': rec.recommendation,
        'rationale': rec.rationale,
        'action': {
            'protocol': rec.protocol,
            'asset': rec.asset,
            'amount': rec.amount,
            'duration': rec.duration
        },
        'timestamp': rec.timestamp.timestamp(),
        'status': rec.status
    } for rec in recommendations])

@api_bp.route('/futarchy/polls', methods=['GET'])
def get_futarchy_polls():
    polls = FutarchyPoll.query.order_by(FutarchyPoll.start_time.desc()).all()
    return jsonify([{
        'id': poll.id,
        'action': poll.action,
        'startTime': poll.start_time.timestamp(),
        'endTime': poll.end_time.timestamp(),
        'yesMarketPrice': poll.yes_market_price,
        'noMarketPrice': poll.no_market_price,
        'resolved': poll.resolved,
        'outcome': poll.outcome
    } for poll in polls])

@api_bp.route('/futarchy/vote', methods=['POST'])
def cast_vote():
    data = request.json
    poll = FutarchyPoll.query.get(data['pollId'])
    
    if not poll or poll.resolved or datetime.utcnow() > poll.end_time:
        return jsonify({'error': 'Invalid poll or poll ended'}), 400
    
    vote = Vote(
        poll_id=data['pollId'],
        voter_address=data['voter'],
        prediction=data['prediction'],
        amount=float(data['amount'])
    )
    
    db.session.add(vote)
    db.session.commit()
    
    # Update market prices
    total_votes = Vote.query.filter_by(poll_id=data['pollId']).count()
    yes_votes = Vote.query.filter_by(poll_id=data['pollId'], prediction=True).count()
    
    poll.yes_market_price = yes_votes / total_votes if total_votes > 0 else 0
    poll.no_market_price = 1 - poll.yes_market_price
    
    db.session.commit()
    
    return jsonify({'status': 'success'})

@api_bp.route('/treasury/status', methods=['GET'])
def get_treasury_status():
    assets = TreasuryAsset.query.order_by(TreasuryAsset.value.desc()).all()
    metrics = PerformanceMetric.query.order_by(PerformanceMetric.timestamp.desc()).first()
    
    return jsonify({
        'totalValue': metrics.total_value if metrics else 0,
        'assets': [{
            'symbol': asset.symbol,
            'amount': asset.amount,
            'value': asset.value,
            'allocation': asset.allocation,
            'protocol': asset.protocol,
            'apy': asset.apy
        } for asset in assets],
        'performanceMetrics': {
            'dailyReturn': metrics.daily_return if metrics else 0,
            'weeklyReturn': metrics.weekly_return if metrics else 0,
            'monthlyReturn': metrics.monthly_return if metrics else 0,
            'yearlyReturn': metrics.yearly_return if metrics else 0,
            'riskAdjustedReturn': metrics.risk_adjusted_return if metrics else 0,
            'diversificationScore': metrics.diversification_score if metrics else 0
        } if metrics else {}
    })

@api_bp.route('/recommendations/generate', methods=['POST'])
def generate_recommendation():
    recommendation = dr_dao.get_recommendations()
    
    new_rec = Recommendation(
        recommendation=recommendation['recommendation'],
        rationale=recommendation['rationale'],
        protocol=recommendation['action']['protocol'],
        asset=recommendation['action']['asset'],
        amount=recommendation['action']['amount'],
        duration=recommendation['action']['duration']
    )
    
    db.session.add(new_rec)
    db.session.commit()
    
    return jsonify({
        'id': new_rec.id,
        'status': 'success'
    })

@api_bp.route('/futarchy/create', methods=['POST'])
def create_futarchy_poll():
    data = request.json
    recommendation = Recommendation.query.get(data['recommendationId'])
    
    if not recommendation:
        return jsonify({'error': 'Recommendation not found'}), 404
    
    poll = FutarchyPoll(
        recommendation_id=recommendation.id,
        action=recommendation.recommendation,
        end_time=datetime.utcnow() + timedelta(days=2)
    )
    
    db.session.add(poll)
    db.session.commit()
    
    return jsonify({
        'id': poll.id,
        'status': 'success'
    }) 