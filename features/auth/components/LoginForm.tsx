"use client";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import { validationSchema } from "../utils/authUtils";
import AlertBox from "@/components/AlertBox";
import {  Eye, EyeOff, UserRound, LockKeyhole, CheckSquare} from "lucide-react";

export default function LoginForm() {
    const [alertText, setAlertText] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setAlertText("");
            try{
                const result = await login(values.username, values.password);
                if(!result.success){
                    setAlertText("Invalid credentials. Please enter valid credentials.");
                }
            }catch{
                setAlertText("Something went wrong. Please try again.");
            }finally{
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="w-full">
            <AlertBox message={alertText} onClose={() => {
                    setAlertText("");
                    formik.resetForm();
                }}
            />

            <div className="mb-7 flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                    <CheckSquare className="h-6 w-6"/>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text">
                    Task<span className="text-primary">Board</span>
                </h1>

                <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
                    Organize your work & Manage your tasks.
                </p>
            </div>

            {/* Login Heading */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-primary-text dark:text-primary-dark-text">
                    Welcome back
                </h2>

                <p className="mt-1.5 text-sm text-secondary-text dark:text-secondary-dark-text">
                    Sign in to continue to your workspace.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-primary-text dark:text-third-dark-text">
                        Username
                    </label>

                    <div className="relative">
                        <UserRound size={18}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input id="username" name="username" type="text"
                            placeholder="Enter your username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-primary-text outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-primary-dark-text dark:focus:bg-slate-800"
                        />
                    </div>

                    {formik.touched.username && formik.errors.username && (
                            <p className="mt-1.5 text-xs font-medium text-error">
                                {formik.errors.username}
                            </p>
                        )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-primary-text dark:text-slate-200">
                        Password
                    </label>

                    <div className="relative">
                        <LockKeyhole size={18}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>

                        <input id="password" name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password" value={formik.values.password}
                            onChange={formik.handleChange}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-11 text-sm text-primary-text outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />

                        <button type="button" onClick={() =>
                                setShowPassword((previous) => !previous)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:text-blue-400">
                            {showPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
                        </button>
                    </div>

                    {formik.touched.password &&
                        formik.errors.password && (
                            <p className="mt-1.5 text-xs font-medium text-error">
                                {formik.errors.password}
                            </p>
                        )}
                </div>

                {/* Submit */}
                <button type="submit" disabled={formik.isSubmitting}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-hover-primary hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {formik.isSubmitting ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}