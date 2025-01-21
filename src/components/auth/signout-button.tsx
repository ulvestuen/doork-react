import { Button } from "@/components/ui/button"
import { SignOutButtonProps } from "@/types";

export function SignOutButton(props: SignOutButtonProps): JSX.Element {
  const { onSignOut, variant, className, children } = props;

  const handleSignOut = () => {
    localStorage.removeItem("__Secure-doork.access_token")
    onSignOut()
  }

  return (
    <Button
      variant={variant || 'outline'}
      onClick={handleSignOut}
      className={className}
    >
      {children || 'Sign Out'}
    </Button>
  )
} 