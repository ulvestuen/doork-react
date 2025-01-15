import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { AuthTabsProps } from "@/types";

export function AuthTabs(props: AuthTabsProps): JSX.Element {
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <div className="min-h-[250px]">
        <TabsContent value="signin" className="m-0">
          <Card className="p-6">
            <SignInForm config={props.signInConfig} />
          </Card>
        </TabsContent>
        <TabsContent value="signup" className="m-0">
          <Card className="p-6">
            <SignUpForm config={props.signUpConfig} />
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}