import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function Profile() {

    const { user } = useAuth();
    const router = useRouter();

    return (
        <div>
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <button onClick={() => router.push('/dashboard')}>back to dashboard</button>
        </div>
    );
}

// export async function getServerSideProps(context) {
//     // const session = await getServerSession(context.req, context.res, authOptions);
//     return {
//         props: {}
//     };
// }
