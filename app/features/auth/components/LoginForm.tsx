'use client';
import { useState } from "react";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col gap-4 p-4  rounded-md shadow-md">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input type="email" id="email" name="email" required 
            className="block w-full rounded-md py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"/>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <input type="password" id="password" name="password" required 
            className="block w-full rounded-md py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"/>
            <button type="submit" className="bg-green-500 text-black font-bold py-2 px-4 rounded-md hover:bg-green-600">
                Login
            </button>
        </div>
    )
}