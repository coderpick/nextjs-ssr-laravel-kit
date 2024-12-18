import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withAuth } from '@/lib/withAuth';
import { front } from '@/lib/axios';

const VerifyEmail = () => {
    const { csrf } = useAuth();
    const router = useRouter();
    const { expires, signature, userId, hash } = router.query;
    const [state, setState] = useState({
        loading: true,
        error: "",
    });

    useEffect(() => {

        const verifyEmail = async () => {
            if(csrf.token){
                const res = await front.get(`/api/auth/email/verify-email?userId=${userId}&hash=${hash}&expires=${expires}&signature=${signature}`,{
                    headers: {
                        'x-csrf-token': csrf.token
                    },
                });

                if (res.data.status == 'redirect') {
                    setState({
                        ...state,
                        loading: false,
                        error: "",
                    });

                    // // Redirect to Home route of the user after 3 seconds.
                    setTimeout(() => {
                        router.push(res.data.redirect_url);
                    }, 3000);
                    return;
                }

                // Set error message if verification failed.
                if (res.error) {
                    setState({
                        ...state,
                        loading: false,
                        error: res.error,
                    });
                }
            }
        }

        verifyEmail();

    }, [csrf.token]);
    
    const headerText = () => {
        if (state.loading) {
            return "We are currently validating your email address...";
        } else if (!state.loading && !state.error) {
            return "Verification successfull!";
        }
        return "Verification failed!";
    }
    
    const header = headerText();
    
    const paragraphText = () => {
        if (state.loading) {
            return "";
        } else if (!state.loading && !state.error) {
            return "Perfect! You will be redirected shortly....";
        }
        return "Sorry, something went wrong!";
    };
    
    const paragraph = paragraphText();
    
    return (
        <div className="w-screen h-screen relative">
            <div className="absolute w-full md:w-3/5 lg:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Card */}
                    <>
                        {/* Header */}
                        <h1 className="text-2xl font-bold mb-4 text-center">
                            {header}
                        </h1>
    
                        {/* Paragraph */}
                        <p className="text-center">
                            {state.loading && <span>Loading...</span>}
                            <span>{paragraph}</span>
                        </p>
                    </>
            </div>
        </div>
    );
}


export const getServerSideProps = withAuth(async (context, user) => {
    const { req } = context;
 

    return {
        props: { 

        },
    };
});

export default VerifyEmail;