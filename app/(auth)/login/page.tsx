import LoginForm from "@/app/features/auth/components/LoginForm"

export default function LoginPage(){
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-gradient-to-br from-green-200 via-green-300 to-green-500">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md rounded-md shadow-md">
                <h1 className="text-2xl font-bold font mb-4 text-center">Welcome Back!!!</h1>
                <h1 className="text-md font-semibold mb-4 text-center">Please Login first to access board..</h1>
                <LoginForm />
            </div>
        </div>
    )
}