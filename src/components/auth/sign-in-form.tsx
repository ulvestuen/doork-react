import { useState } from "react";
import { Fingerprint, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { SignInFormProps } from "@/types";

export function SignInForm(props: SignInFormProps): JSX.Element {
  const { config: { apiBaseUrl, onAuthSuccess, onAuthError } } = props;

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    try {
      setIsLoading(true);

      // Start authentication
      const startAuthResponse = await fetch(`${apiBaseUrl}/authenticate`, {
        method: "POST",
      });

      if (!startAuthResponse.ok) throw new Error("Failed to start authentication");

      const sessionId = startAuthResponse.headers.get("Session-Id") || "";
      const options = await startAuthResponse.json();

      // Add default empty array if allowCredentials is missing
      if (!options.publicKey.allowCredentials) {
        options.publicKey.allowCredentials = [];
      }

      // Get credentials with proper challenge encoding
      const cred = await navigator.credentials.get({
        publicKey: {
          ...options.publicKey,
          challenge: Uint8Array.from(
            atob(options.publicKey.challenge.replace(/-/g, '+').replace(/_/g, '/')),
            c => c.charCodeAt(0)
          ),
          allowCredentials: options.publicKey.allowCredentials.map((cred: any) => ({
            ...cred,
            id: Uint8Array.from(
              atob(cred.id.replace(/-/g, '+').replace(/_/g, '/')),
              c => c.charCodeAt(0)
            ),
          })),
        },
      }) as PublicKeyCredential;

      if (!cred) throw new Error("Failed to get credentials");

      // Prepare credential for sending to server
      const credential = {
        id: cred.id,
        type: cred.type,
        rawId: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(cred.rawId))))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        response: {
          clientDataJSON: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAssertionResponse).clientDataJSON))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          authenticatorData: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAssertionResponse).authenticatorData))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          signature: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAssertionResponse).signature))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          userHandle: (cred.response as AuthenticatorAssertionResponse).userHandle
            ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAssertionResponse).userHandle!))))
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '')
            : null
        }
      };

      // Finish authentication
      const finishAuthResponse = await fetch(`${apiBaseUrl}/authenticate/finish`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Session-Id": sessionId,
        },
        body: JSON.stringify(credential),
      });

      if (!finishAuthResponse.ok) {
        throw new Error("Failed to finish authentication");
      }

      const tokenResponse = await finishAuthResponse.json();
      localStorage.setItem("__Secure-doork.access_token", tokenResponse.access_token);

      if (onAuthSuccess) {
        onAuthSuccess("Authentication successful");
      }

    } catch (error: unknown) {
      if (error instanceof Error && onAuthError) {
        onAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-fullspace-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-center">Welcome Back</h2>
        <p className="text-sm text-muted-foreground text-center">
          Sign in securely with your passkey
        </p>
      </div>
      <div className="pt-2">
        <Button
          onClick={handleSignIn}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Fingerprint className="mr-2 h-4 w-4" />
          )}
          Sign in with Passkey
        </Button>
      </div>
    </div>
  );
}