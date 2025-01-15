import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Fingerprint, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SignUpFormProps } from "@/types";

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpForm(props: SignUpFormProps): JSX.Element {
  const { config: { apiBaseUrl, onAuthSuccess, onAuthError } } = props;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(data: SignUpForm) {
    try {
      setIsLoading(true);

      // Start registration
      const startRegResponse = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!startRegResponse.ok) throw new Error("Failed to start registration");

      const sessionId = startRegResponse.headers.get("Session-Id") || "";
      const options = await startRegResponse.json();

      // Create credentials with proper challenge and user ID encoding
      const cred = await navigator.credentials.create({
        publicKey: {
          ...options.publicKey,
          challenge: Uint8Array.from(
            atob(options.publicKey.challenge.replace(/-/g, '+').replace(/_/g, '/')),
            c => c.charCodeAt(0)
          ),
          user: {
            ...options.publicKey.user,
            id: Uint8Array.from(
              atob(options.publicKey.user.id.replace(/-/g, '+').replace(/_/g, '/')),
              c => c.charCodeAt(0)
            ),
          },
        },
      }) as PublicKeyCredential;

      if (!cred) {
        throw new Error("Failed to create credentials");
      }

      // Prepare credential for sending to server
      const credential = {
        id: cred.id,
        type: cred.type,
        rawId: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(cred.rawId))))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        response: {
          clientDataJSON: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAttestationResponse).clientDataJSON))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          attestationObject: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array((cred.response as AuthenticatorAttestationResponse).attestationObject))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
        }
      };

      // Finish registration
      const finishRegResponse = await fetch(`${apiBaseUrl}/register/finish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Session-Id": sessionId,
          },
          body: JSON.stringify(credential),
        });

      if (!finishRegResponse.ok) {
        throw new Error("Failed to complete registration");
      }

      if (onAuthSuccess) {
        onAuthSuccess("Registration successful");
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
    <div className={"w-full"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Fingerprint className="mr-2 h-4 w-4" />
            )}
            Register with Passkey
          </Button>
        </form>
      </Form>
    </div >
  );
}