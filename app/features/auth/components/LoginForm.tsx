'use client';
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import {validationSchema} from "../utils/authUtils";
import AlertBox from "@/components/AlertBox";
import {Eye, EyeOff} from "lucide-react";

//invalid then popup but not can touch any of the field
//formik.touched not working
export default function LoginForm() {
    const [alertText, setAlertText] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {login} = useAuth();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema, 
        onSubmit: (values, { setSubmitting }) => {
           setAlertText("");  //empty old alert message
            const isSuccess = login(values.email, values.password);
            if(!isSuccess) {
               setAlertText("Wrong email or password.Enter valid email or password.");
            }
            setSubmitting(false); 
            
        },
    });

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <>
           <AlertBox message={alertText} onClose={() => setAlertText("")} />
            
            <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div>
                    
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email
                    </label>
                    <input type="email" id="email" name="email" required 
                    placeholder="Enter email"
                    className="block w-full border rounded-lg border-gray-300 bg-gray-100 p-2.5 mt-1.5 mb-4 text-sm text-gray-900 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} //validation trigger when user leaves the input field
                    />
                    {formik.errors.email && formik.touched.email ? (
                        <p className="text-red-500 text-xs mt-0 mb-2 font-medium">*{formik.errors.email}</p>
                        ) : null
                    }
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        Password
                    </label>
                    <div className="relative w-full">
                        <input type={showPassword ? "text" : "password"} 
                        name="password" required 
                        placeholder="Enter password" 
                        className="block w-full border rounded-lg border-gray-300 bg-gray-100 p-2.5 pr-10 mt-1.5 mb-4 text-sm text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        />

                        <button 
                        type="button" 
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        > 
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />} 
                        </button> 
                    </div>
                    {formik.errors.password && formik.touched.password ? (
                        <p className="text-red-500 text-xs mb-2 font-medium">*{formik.errors.password}</p>
                        ) : null
                    }
                </div>
                    
                    <button type="submit" className="w-full border rounded-lg py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 mt-2">
                        Login
                    </button>
            </form>
        </>
    )
}