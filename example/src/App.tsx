import React, { useEffect, useState } from 'react';
import { AuthTabs, UserData, UserProfile } from '@ulvestuen/doork-react';
import '@ulvestuen/doork-react/dist/index.css';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

const App: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);


    useEffect(() => {
        const token = localStorage.getItem("__Secure-doork.access_token");
        if (token) {
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = (token: string) => {
        fetch(`https://doork.vercel.app/api/user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(new Error("Failed to fetch user data"));
            })
            .then(
                data => setUserData(data),
                error => {
                    localStorage.removeItem("__Secure-doork.access_token");
                    setUserData(null);
                }
            );
    }


    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            {userData
                ? <UserProfile
                    config={{ apiBaseUrl: "https://doork.vercel.app/api" }}
                    userData={userData}
                />
                : <div className="max-w-md w-full mx-auto px-4">
                    <AuthTabs
                        signInConfig={{
                            apiBaseUrl: "https://doork.vercel.app/api",
                            onAuthError: (e: Error) => toast.error(e.message),
                            onAuthSuccess: (m: string) => {
                                toast.success(m);
                                const token = localStorage.getItem("__Secure-doork.access_token");
                                if (token) {
                                    fetchUserData(token);
                                }
                            },
                        }}
                        signUpConfig={{
                            apiBaseUrl: "https://doork.vercel.app/api",
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