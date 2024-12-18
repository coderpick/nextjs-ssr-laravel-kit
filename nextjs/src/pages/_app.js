import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({Component, pageProps: { session, ...pageProps }}) {

  return (
      <AuthProvider initialUser={pageProps.user}>
        <Component {...pageProps} />
        <ToastContainer />
      </AuthProvider>
  );
}
