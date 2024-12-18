import Button from '@/components/Button'
import { useState } from 'react'
import { withAuth } from "@/lib/withAuth";
import GuestLayout from '@/components/Layouts/GuestLayout';
import AuthCard from '@/components/AuthCard';
import { front } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmail = () => {
    const { csrf } = useAuth();

    const [loading, setLoading] = useState(false);

    const resendEmailVerification = async ({ setStatus }) => {
        try {
            setLoading(true);
            const response = await front.post('/api/auth/email/verify-email-notification', {},{
                headers: {
                    'x-csrf-token': csrf.token
                },
            });
            setStatus(response.data.status)
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    const [status, setStatus] = useState(null)

    return (
        <GuestLayout>
            <AuthCard>

                <div className="mb-4 text-sm text-gray-600">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just
                    emailed to you? If you didn't receive the email, we will gladly
                    send you another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <Button onClick={() => resendEmailVerification({ setStatus })}
                        disabled={loading}
                    >
                        {loading ? 'Sending Verification Email...' : 'Resend Verification Email'}
                    </Button>
                </div>
            </AuthCard>
        </GuestLayout>
    )
}

export default VerifyEmail

export const getServerSideProps = withAuth(async (context, user) => {
    const { req } = context;

    // if (!hasPermission(user, 'create post')) {

    //     // return redirect back to 403 page
    //     return {
    //         redirect: {
    //             destination: '/403',
    //             permanent: false,
    //         },
    //     };
    // }


    return {
        props: { user }, // Pass the user data to the page component
    };
});