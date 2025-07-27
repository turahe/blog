import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return require('react').createElement('img', props)
  },
}))



// Mock use-sound hook
jest.mock('use-sound', () => ({
  __esModule: true,
  default: () => [jest.fn(), { sound: null }],
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => require('react').createElement('div', props, children),
    span: ({ children, ...props }) => require('react').createElement('span', props, children),
    button: ({ children, ...props }) => require('react').createElement('button', props, children),
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock react-rough-notation
jest.mock('react-rough-notation', () => ({
  __esModule: true,
  default: ({ children, ...props }) => require('react').createElement('span', props, children),
}))

// Mock typewriter-effect
jest.mock('typewriter-effect', () => ({
  __esModule: true,
  default: ({ onInit, options }) => {
    const React = require('react')
    React.useEffect(() => {
      if (onInit) {
        onInit({ typeString: jest.fn() })
      }
    }, [onInit])
    return React.createElement('div', { 'data-testid': 'typewriter' })
  },
}))

// Mock pliny modules
jest.mock('pliny/search/AlgoliaButton', () => ({
  __esModule: true,
  AlgoliaButton: ({ children, ...props }) => require('react').createElement('button', props, children),
}))

jest.mock('pliny/search/KBarButton', () => ({
  __esModule: true,
  KBarButton: ({ children, ...props }) => require('react').createElement('button', props, children),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock 