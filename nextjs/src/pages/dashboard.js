import { useAuth } from "@/contexts/AuthContext";
import { withAuth } from "@/lib/withAuth";
import AppLayout from "@/components/Layouts/AppLayout";

export default function Dashboard({ user }) {

    /**
     * use this for checking if the user has a role there are several other authorization helpers in the authorize.js file
     */
    const { hasRole } = useAuth();

    return (
        <>
            <AppLayout >
                <div className="min-h-screen bg-gray-100">
                    <div className="py-10">
                        <main>
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h2 className="text-2xl font-bold mb-4">User Details</h2>
                                        {user && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                                    <div className="mt-1 text-lg">{user.name}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <div className="mt-1 text-lg">{user.email}</div>
                                                </div>


                                              

                                            </div>
                                        )}
                                       
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

export const getServerSideProps = withAuth(async (context, user) => {
    const { req } = context;

    /**
     * Authorization helpers example of permission check
     * 
     */
    
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