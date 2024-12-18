import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { withAuth } from "@/lib/withAuth";
import AuthCard from "@/components/AuthCard";
import GuestLayout from "@/components/Layouts/GuestLayout";
import InputError from "@/components/InputError";
import { REDIRECT_IF_AUTHENTICATED } from "@/lib/route-service-provider";
import { front } from "@/lib/axios";
import Button from "@/components/Button";
import Link from "next/link";
import Label from "@/components/Label";
import Input from "@/components/Input";
import AuthSessionStatus from "@/components/AuthSessionStatus";
import ApplicationLogo from "@/components/ApplicationLogo";

export default function Login() {
    const { csrf } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null)

    const router = useRouter();

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })


    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        try {
         
            const result = await front.post('/api/auth/login', {
                email,
                password,
                csrf_token: csrf.token
            });

            await new Promise(resolve => setTimeout(resolve, 500));
            router.push(REDIRECT_IF_AUTHENTICATED);

        } catch (error) {
            if(error.response.status == 422) {
                setErrors(error.response.data.errors ?? error.response.data);
            } else {
                setErrors({
                    message: `An error occurred during login (${error.response.data.error})`,
                    // email: "An error occurred during login",
                    // password: "An error occurred during login",
                });
            }
        } finally {
            setLoading(false);
        }
    };

   
    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                
                {
                    errors?.message && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                            <div className="text-sm text-red-700">{errors?.message}</div>
                        </div>
                    )
                }
                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                  

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/forgot-password"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                        </Link>

                        <Button className="ml-3"
                            disabled={loading}
                        >{ loading ? 'Logging in...' : 'Login' }</Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    );
}

export const getServerSideProps = withAuth(async (context) => {
    return {
        props: {},
    };
});