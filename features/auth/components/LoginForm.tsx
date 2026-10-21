"use client";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import { validationSchema } from "../utils/authUtils";
import AlertBox from "@/components/AlertBox";
import { Eye, EyeOff } from "lucide-react";

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
            try{
                const result = await login(values.username, values.password);
                if(!result.success){
                    setAlertText("Invalid credentials.Please enter the valid credentials.");
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

            <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
                <div>
                    <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-slate-200">Username</label>
                    <input id="username" name="username" type="text"
                        placeholder="Enter username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full border rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 p-2.5 pr-10 mt-1.5 mb-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-xs">
                            {formik.errors.username}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
                        Password
                    </label>
                    <div className="relative w-full">
                        <input type={showPassword ? "text" : "password"} name="password"
                            id="password" placeholder="Enter password"
                            className="block w-full border rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 p-2.5 pr-10 mt-1.5 mb-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        <button type="button" onClick={togglePassword}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {formik.errors.password && formik.touched.password ? (
                        <p className="text-red-500 text-xs mb-2 font-medium">*{formik.errors.password}</p>
                    ) : null}
                </div>

                <button type="submit" disabled={formik.isSubmitting}
                    className="mt-2 w-full rounded-lg border border-blue-600 bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    {formik.isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </>
    );
}