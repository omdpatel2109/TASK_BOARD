import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-200 to-blue-400 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="bg-white dark:bg-slate-950 p-8 w-full max-w-md rounded-md shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-700 dark:text-blue-400">Welcome Back!!!</h1>
                <h1 className="mb-4 text-center text-sm text-slate-600 dark:text-slate-300">Please Login first to access board..</h1>
                <LoginForm />
            </div>
        </div>
    );
}