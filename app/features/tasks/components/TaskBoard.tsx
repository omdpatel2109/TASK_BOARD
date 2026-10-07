import TaskCard from "./TaskCard";

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

                <div className="grid grid-cols-3 gap-2 ml-5 mr-5 mb-5">

                    <div className="border border-blue-500 text-lg border-2 rounded-md text-center bg-blue-100 ">
                        <div className="flex justify-between">
                            <span className="w-full border-b-2 border-b-blue-500 text-blue-600 bg-blue-200 hover:bg-blue-300">
                                To do
                            </span>
                        </div>

                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        <TaskCard/>
                        
                    </div>
                    
                    <div className="border border-amber-500 border-2 text-lg rounded-md text-center bg-amber-100">
                        <div className="flex justify-between">
                            <span className="w-full border-b-2 border-b-amber-500 text-amber-600 bg-amber-200 hover:bg-amber-300">In Progress</span>
                        </div>
                    </div>

                    <div className="border border-green-500 border-2 text-lg rounded-md text-center bg-green-100">
                        <div className="flex justify-between">
                            <span className="w-full border-b-2 border-b-green-500 text-green-600 bg-green-200 hover:bg-green-300">Done</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}