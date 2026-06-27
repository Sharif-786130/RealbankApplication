import AppRoutes from "./routes/AppRoutes";
import { useAuthInit } from "./app/useAuthInit";

export default function App() {
    const isReady = useAuthInit();

    // Block rendering until silent refresh completes.
    // Without this, ProtectedRoute checks the token before
    // refresh finishes and redirects you to /login.
    if (!isReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-amber-50">
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        );
    }

    return <AppRoutes />;
}