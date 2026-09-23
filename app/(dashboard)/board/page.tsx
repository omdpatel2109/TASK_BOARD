export default function DashboardPage(){
    return (
        //kanban board design page
        <div className="w-full h-full bg-gray-100 ">
            <div>
                
            </div>
            <div className="grid grid-cols-3 gap-2 m-5 h-100">
                <div className="border border-red-300 text-lg rounded-md text-center bg-red-100 p-4">
                    <span className="border rounded p-1 mt-5 w-full border-red-500 border-2 text-red-600">To do</span>
                </div>
                <div className="border border-yellow-300 text-lg rounded-md text-center bg-yellow-100 p-4">
                    <span className="border rounded p-1 mt-5 w-full border-yellow-500 border-2 text-yellow-600">In Progress</span>
                </div>
                <div className="border border-green-300 text-lg rounded-md text-center bg-green-100 p-4">
                    <span className="border rounded p-1 mt-5 w-full border-green-500 border-2 text-green-600">Done</span>
                </div>
            </div>
        </div>
    )
}