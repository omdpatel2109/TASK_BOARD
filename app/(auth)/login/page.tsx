import LoginForm from "@/features/auth/components/LoginForm";
export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
                <LoginForm />
            </div>
        </main>
    );
}
