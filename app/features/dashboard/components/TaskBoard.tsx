export default function TaskBoard(){
    return(
        <>
            <div className="w-full">

                <div className="ml-5 mr-5 mt-2 mb-2 h-14 rounded rounded-md flex justify-between">
                    <span className="m-2 py-2 px-4 text-gray-900 text-xl font-bold">Task Status</span>
                    <button className="bg-green-600 m-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded rounded-lg">
                        + Add task
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 ml-5 mr-5 mb-5 min-h-screen">

                    <div className="border border-red-300 text-lg rounded-md text-center bg-red-100 p-3">
                        <div className="flex justify-between">
                            <span className="border rounded rounded-full w-full border-red-500 border-2 text-red-600 bg-red-200 hover:bg-red-300">To do</span>
                        </div>
                    </div>
                    
                    <div className="border border-yellow-300 text-lg rounded-md text-center bg-yellow-100 p-3">
                        <div className="flex justify-between">
                            <span className="border rounded rounded-full w-full border-yellow-500 border-2 text-yellow-600 bg-yellow-200 hover:bg-yellow-300">In Progress</span>
                        </div>
                    </div>

                    <div className="border border-green-300 text-lg rounded-md text-center bg-green-100 p-3">
                        <div className="flex justify-between">
                            <span className="border rounded rounded-full w-full border-green-500 border-2 text-green-600 bg-green-200 hover:bg-green-300">Done</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}