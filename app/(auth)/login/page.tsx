import LoginForm from "@/features/auth/components/LoginForm";
export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
            <section className="w-full max-w-md">
                {/* Brand */}
                <div className="mb-8 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        TaskBoard
                    </h1>
                </div>

                {/* Login card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Sign in to access your workspace and manage your tasks.
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </section>
        </main>
    );
}
