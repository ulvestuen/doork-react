# @ulvestuen/eniro-react

React components for Eniro authentication and user profile management. This library provides ready-to-use components for implementing passkey-based authentication and user profile management in your React applications.

## Features

- Passkey-based authentication (WebAuthn)
- Sign in and sign up forms
- User profile management
- Email verification
- Customizable theming
- TypeScript support
- Modern UI with Tailwind CSS

## Installation

```bash
npm install @ulvestuen/eniro-react
# or
yarn add @ulvestuen/eniro-react
```

## Usage

```tsx
import { AuthTabs, UserProfile } from '@ulvestuen/eniro-react';

// Configure your authentication settings
const config = {
  apiBaseUrl: 'https://your-api.com',
  onAuthSuccess: (token) => {
    // Handle successful authentication
    console.log('Authentication successful:', token);
  },
  onAuthError: (error) => {
    // Handle authentication errors
    console.error('Authentication error:', error);
  },
  onEmailVerified: () => {
    // Handle email verification success
    console.log('Email verified successfully');
  },
};

// Optional theme customization
const theme = {
  primary: '#0091ff',
  secondary: '#6366f1',
  background: '#ffffff',
  text: '#000000',
  error: '#ef4444',
};

function App() {
  return (
    <div>
      {/* Authentication Component */}
      <AuthTabs 
        config={config}
        theme={theme}
        defaultTab="signin"
      />

      {/* User Profile Component */}
      <UserProfile 
        config={config}
        theme={theme}
      />
    </div>
  );
}
```

## Components

### AuthTabs

A tabbed interface that provides both sign-in and sign-up functionality using passkeys.

Props:
- `config`: AuthConfig (required)
- `theme`: Theme (optional)
- `className`: string (optional)
- `defaultTab`: 'signin' | 'signup' (optional)

### UserProfile

A component that displays user information and handles email verification.

Props:
- `config`: AuthConfig (required)
- `theme`: Theme (optional)
- `className`: string (optional)
- `userData`: UserData (optional)

## Configuration

The `AuthConfig` interface includes:

```typescript
interface AuthConfig {
  apiBaseUrl: string;
  onAuthSuccess?: (token: string) => void;
  onAuthError?: (error: Error) => void;
  onEmailVerified?: () => void;
}
```

## Theme Customization

The `Theme` interface allows you to customize the appearance:

```typescript
interface Theme {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string;
  error?: string;
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the library: `npm run build`
4. Run tests: `npm test`

## License

MIT
