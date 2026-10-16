import LoginForm from "@/features/auth/components/LoginForm"
import Link from "next/link"

export default function LoginPage(){
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-gradient-to-br from-green-200 via-green-300 to-green-500">
            <div className="bg-gray-100 p-8 w-full max-w-md rounded-md shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome Back!!!</h1>
                <h1 className="mb-4 text-center text-sm text-gray-600">Please Login first to access board..</h1>
                <LoginForm />

            </div>
        </div>
        
    )
}