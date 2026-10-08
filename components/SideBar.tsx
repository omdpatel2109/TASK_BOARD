export default function SideBar() {
    return (
        <div className="w-72 bg-white border-r border-gray-200 sticky top-0 h-screen flex flex-col">
            <div className="p-4">
                {/* Dashboard */}
                <a href="#"
                    className="flex items-center px-4 py-2.5 text-lg text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                >
                    <span className="mr-3 text-gray-500"></span>
                    Dashboard
                </a>

                {/* Tasks */}
                <a href="#"
                    className="flex items-center px-4 py-2.5 mt-1 text-lg text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                >
                    <span className="mr-3 text-gray-500"></span>
                    Tasks
                </a>

                {/* Settings */}
                <a href="#"
                    className="flex items-center px-4 py-2.5 mt-1 text-lg text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                >
                    <span className="mr-3 text-gray-500"></span>
                    Settings
                </a>
            </div>

            {/* Logout */}
            <div className="mt-auto p-4 border-t border-gray-200">
                <button
                    className="w-full py-2.5 px-4 text-lg font-medium text-white border bg-red-500 border-gray-200 rounded-md hover:bg-red-600 hover:text-white                   transition-colors"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}