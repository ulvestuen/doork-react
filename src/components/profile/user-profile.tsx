import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Plus, Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/loading-spinner";
import { UserProfileProps } from "@/types";

interface UserData {
  id: string;
  username: string;
  email?: string;
}

export function UserProfile(props: UserProfileProps): JSX.Element {
  const { config: { apiBaseUrl } } = props;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchUserData().then();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/user`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("__Secure-eniro.access_token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/user/email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("__Secure-eniro.access_token"),
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send verification email");

      setIsVerifying(true);
      toast.success("Verification code sent to your email");
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/user/email/verify`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("__Secure-eniro.access_token"),
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify code");
      }

      toast.success("Email verified successfully");
      setIsVerifying(false);
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error("Failed to verify code");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {userData?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle>{userData?.username}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">ID: {userData?.id}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Email Address</h3>
              {userData?.email ? (
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No email address registered</p>
              )}
            </div>
            {!userData?.email && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    {!isVerifying ? (
                      <>
                        <h4 className="font-medium leading-none">Add Email Address</h4>
                        <div className="flex items-center gap-2">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Button onClick={handleSendVerification} className="w-9 h-9 p-0">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium leading-none">Add Email Address</h4>
                        <div className="flex items-center gap-2">
                          <InputOTP
                            value={verificationCode}
                            onChange={setVerificationCode}
                            maxLength={6}
                            pattern="[a-zA-Z0-9]"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                          <Button onClick={handleVerifyCode} className="w-9 h-9 p-0">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}