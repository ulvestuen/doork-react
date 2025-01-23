import React, { useEffect, useState } from 'react';
import { AuthTabs, UserData, UserProfile, SignOutButton } from '@ulvestuen/doork-react';
import '@ulvestuen/doork-react/dist/index.css';
import { Toaster, toast } from 'sonner';

const App: React.FC<{ apiBaseUrl?: string }> = ({ apiBaseUrl }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    apiBaseUrl = apiBaseUrl || "https://doork.vercel.app/api";

    useEffect(() => {
        const token = localStorage.getItem("__Secure-doork.access_token");
        token && fetchUserData(token);
    }, []);

    const fetchUserData = (token: string) => {
        fetch(`${apiBaseUrl}/user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.ok 
                ? res.json() 
                : Promise.reject(new Error("Failed to fetch user data")))
            .then(
                data => setUserData(data),
                error => {
                    localStorage.removeItem("__Secure-doork.access_token");
                    setUserData(null);
                }
            );
    }

    const handleSignOut = () => {
        window.location.href = "/";
    };


    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            {userData
                ?
                <div className="flex flex-col w-1/2 items-center justify-center">
                    <UserProfile
                        config={{ apiBaseUrl: apiBaseUrl }}
                        userData={userData}
                        className="w-full"
                    />
                    <div className="flex flex-col w-full mt-4 items-end justify-center">
                        <SignOutButton onSignOut={handleSignOut}>
                            Sign Out
                        </SignOutButton>
                    </div>
                </div>
                : <div className="max-w-md w-full mx-auto px-4">
                    <AuthTabs
                        signInConfig={{
                            apiBaseUrl: apiBaseUrl,
                            onAuthError: (e: Error) => toast.error(e.message),
                            onAuthSuccess: (m: string) => {
                                toast.success(m);
                                const token = localStorage.getItem("__Secure-doork.access_token");
                                token && fetchUserData(token);
                            },
                        }}
                        signUpConfig={{
                            apiBaseUrl: apiBaseUrl,
                            onAuthError: (e: Error) => toast.error(e.message),
                            onAuthSuccess: (m: string) => toast.success(m),
                        }}
                        className="w-full"
                        defaultTab="signin"
                    />
                    <Toaster />
                </div>
            }
        </div>
    );
}

export default App;