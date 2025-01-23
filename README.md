# @ulvestuen/doork-react

React components for Doork authentication and user profile management. This library provides ready-to-use components for implementing passkey-based authentication (WebAuthn) in your React applications.

## Features

- Passkey-based authentication (WebAuthn)
- Sign in and sign up forms
- User profile management with email verification
- Modern UI built with shadcn/ui components
- TypeScript support
- Customizable theming with Tailwind CSS

## Installation

```bash
npm install @ulvestuen/doork-react
```

## Usage

```tsx
import { AuthTabs, UserProfile, SignOutButton } from '@ulvestuen/doork-react';
import '@ulvestuen/doork-react/dist/index.css';

function App() {
  const apiBaseUrl = import.meta.env.DOORK_API_BASE_URL || "https://doork.vercel.app/api";
  const [userData, setUserData] = useState(null);

  const handleSignOut = () => {
    window.location.href = "/";
  };

  return (
    <div>
      {userData ? (
        <div>
          <UserProfile 
            config={{ apiBaseUrl }}
            userData={userData}
          />
          <SignOutButton onSignOut={handleSignOut}>
            Sign Out
          </SignOutButton>
        </div>
      ) : (
        <AuthTabs 
          signInConfig={{
            apiBaseUrl,
            onAuthSuccess: (message) => {
              // Handle successful authentication
            },
            onAuthError: (error) => {
              // Handle authentication errors
            },
          }}
          signUpConfig={{
            apiBaseUrl,
            onAuthSuccess: (message) => {
              // Handle successful registration
            },
            onAuthError: (error) => {
              // Handle registration errors
            },
          }}
          defaultTab="signin"
        />
      )}
    </div>
  );
}
```

## Components

### AuthTabs
A tabbed interface for sign-in and sign-up functionality using passkeys.

Props:
- `signInConfig`: AuthConfig
- `signUpConfig`: AuthConfig
- `className?`: string
- `defaultTab?`: 'signin' | 'signup'

### UserProfile
Displays user information and handles email verification.

Props:
- `config`: AuthConfig
- `className?`: string
- `userData?`: UserData

### SignOutButton
A button component that handles sign-out functionality.

Props:
- `onSignOut`: () => void
- `variant?`: string
- `className?`: string
- `children?`: React.ReactNode

## Configuration

```typescript
interface AuthConfig {
  apiBaseUrl: string;
  onAuthSuccess?: (message: string) => void;
  onAuthError?: (error: Error) => void;
}

interface UserData {
  id: string;
  username: string;
  email?: string;
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the example: `npm run dev`

## License

MIT
