// Polyfill for localStorage in SSR environment
if (typeof window === 'undefined') {
  // Mock localStorage for server-side rendering
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };

  // @ts-ignore
  global.localStorage = localStorageMock;
}

export {};
