'use client';
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import {validationSchema} from "../utils/authUtils";
import AlertBox from "@/components/AlertBox";

//invalid then popup but not can touch any of the field
//formik.touched not working
export default function LoginForm() {
    const [alertText, setAlertText] = useState("");

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

    return (
        <>
           <AlertBox message={alertText} onClose={() => setAlertText("")} />
            
            <form onSubmit={formik.handleSubmit} >
                <div className="flex flex-col gap-4 p-4  rounded-md shadow-md">
                    
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input type="email" id="email" name="email" required 
                    className="block w-full rounded-md py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 
                    placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} //validation trigger when user leaves the input field
                    />
                    {formik.errors.email && formik.touched.email ? (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
                        ) : null
                    }
                    
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input type="password" id="password" name="password" required 
                    className="block w-full rounded-md py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 
                    placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password ? (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</p>
                        ) : null
                    }
                    
                    <button type="submit" className="bg-green-500 text-black font-bold py-2 px-4 
                    rounded-md hover:bg-green-600">
                        Login
                    </button>
                </div>
            </form>
        </>
    )
}