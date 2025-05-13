from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

def init_db(app):
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()

class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(Integer, primary_key=True)
    recommendation = Column(String)
    rationale = Column(String)
    protocol = Column(String)
    asset = Column(String)
    amount = Column(String)
    duration = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default='pending')  # pending, approved, rejected

class FutarchyPoll(Base):
    __tablename__ = 'futarchy_polls'

    id = Column(Integer, primary_key=True)
    recommendation_id = Column(Integer, ForeignKey('recommendations.id'))
    action = Column(String)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    yes_market_price = Column(Float, default=0)
    no_market_price = Column(Float, default=0)
    resolved = Column(Boolean, default=False)
    outcome = Column(Boolean)

    recommendation = relationship("Recommendation")
    votes = relationship("Vote", back_populates="poll")

class Vote(Base):
    __tablename__ = 'votes'

    id = Column(Integer, primary_key=True)
    poll_id = Column(Integer, ForeignKey('futarchy_polls.id'))
    voter_address = Column(String)
    prediction = Column(Boolean)
    amount = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    poll = relationship("FutarchyPoll", back_populates="votes")

class TreasuryAsset(Base):
    __tablename__ = 'treasury_assets'

    id = Column(Integer, primary_key=True)
    symbol = Column(String)
    amount = Column(Float)
    value = Column(Float)
    allocation = Column(Float)
    protocol = Column(String)
    apy = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class PerformanceMetric(Base):
    __tablename__ = 'performance_metrics'

    id = Column(Integer, primary_key=True)
    total_value = Column(Float)
    daily_return = Column(Float)
    weekly_return = Column(Float)
    monthly_return = Column(Float)
    yearly_return = Column(Float)
    risk_adjusted_return = Column(Float)
    diversification_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow) 