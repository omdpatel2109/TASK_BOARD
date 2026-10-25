"use client";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import { validationSchema } from "../utils/authUtils";
import AlertBox from "@/components/AlertBox";
import { Eye, EyeOff, UserRound, LockKeyhole, ArrowRight } from "lucide-react";

export default function LoginForm() {
    const [alertText, setAlertText] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setAlertText("");
            try {
                const result = await login(values.username, values.password);
                if(!result.success){
                    setAlertText("Invalid credentials. Please enter the valid credentials.");
                }
            }catch{
                setAlertText("Something went wrong. Please try again.");
            }finally{
                setSubmitting(false);
            }
        },
    });

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <AlertBox message={alertText} onClose={() => {
                    setAlertText("");
                    formik.resetForm();
                }}
            />

            <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                    <label htmlFor="username" className="mb-2 block text-sm font-semibold text-secondary-text dark:text-slate-200">
                        Username
                    </label>

                    <div className="relative">
                        <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>

                        <input id="username" name="username" type="text"
                            placeholder="Enter your username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-primary-text outline-none placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-800"
                        />
                    </div>

                    {formik.touched.username && formik.errors.username && (
                        <p className="mt-2 text-xs font-medium text-error">
                            {formik.errors.username}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-secondary-text dark:text-slate-200">
                        Password
                    </label>

                    <div className="relative">
                        <LockKeyhole size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input type={showPassword ? "text" : "password"} name="password"
                            id="password" placeholder="Enter your password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-primary-text outline-none      placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-800"/>

                        <button type="button" onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:text-blue-400">
                            {showPassword ? ( <EyeOff size={19} /> ) : (<Eye size={19} />)}
                        </button>
                    </div>

                    {formik.touched.password && formik.errors.password && (
                        <p className="mt-2 text-xs font-medium text-error">
                            {formik.errors.password}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button type="submit" disabled={formik.isSubmitting}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-hover-primary hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none">
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
        </>
    );
}
