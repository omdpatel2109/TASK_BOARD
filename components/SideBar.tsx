export default function SideBar(){
    return(
        <div className="w-75 bg-slate-900 grid sticky top-0 h-screen">
            <div className="p-4">
                <a href="#" className="block px-4 py-2 text-gray-100 hover:bg-gray-800 rounded">
                    Dashboard
                </a>
                <a href="#" className="block px-4 py-2 mt-1 text-gray-100 hover:bg-gray-800 rounded">
                    Tasks
                </a>    
                <a href="#" className="block px-4 py-2 mt-1 text-gray-100 hover:bg-gray-800 rounded">
                    Settings
                </a>
            </div>  
            
                <div className="flex p-4 items-end mb-1">
                    <button className="bg-red-600 hover:bg-red-700 w-full text-white font-bold py-2 px-4 rounded">
                        Log out
                    </button>
                </div>
            
        </div>
    )
}