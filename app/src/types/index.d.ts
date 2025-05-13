declare module 'react-query' {
  export * from '@tanstack/react-query';
}

declare module 'wagmi' {
  export * from '@wagmi/core';
}

declare module 'recharts' {
  export * from '@types/recharts';
}

declare module '@rainbow-me/rainbowkit' {
  export * from '@rainbow-me/rainbowkit/dist/index';
}

declare module '@heroicons/react/*' {
  const content: any;
  export default content;
}

declare module '@headlessui/react' {
  export * from '@headlessui/react/dist/index';
} 