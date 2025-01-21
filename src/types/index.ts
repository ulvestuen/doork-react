export interface UserData {
  id: string;
  username: string;
  email?: string;
}

export interface AuthConfig {
  apiBaseUrl: string;
  onAuthSuccess?: (message: string) => void;
  onAuthError?: (error: Error) => void;
  onEmailVerified?: () => void;
  onSignIn?: () => Promise<void>;
  onSignUp?: (data: { username: string }) => Promise<void>;
}

export interface AuthTabsProps {
  signInConfig: AuthConfig;
  signUpConfig: AuthConfig;
  className?: string;
  defaultTab?: 'signin' | 'signup';
}

export interface SignInFormProps {
  config: AuthConfig;
  className?: string;
}

export interface SignUpFormProps {
  config: AuthConfig;
  className?: string;
}

export interface UserProfileProps {
  config: AuthConfig;
  className?: string;
  userData?: UserData;
}

export type Variant = "outline" | "default" | "destructive" | "secondary" | "ghost" | "link" | null | undefined

export interface SignOutButtonProps {
  onSignOut: () => void;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}
