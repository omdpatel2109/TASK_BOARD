// "use client";
// import Link from "next/link";
// import { useTasks } from "@/features/tasks/hooks/useTasks";
// export default function Dashboard() {
//     const { tasks, columns, isLoading, error } = useTasks();
//     const completedColumnIds = columns
//         .filter((column) => /^(done|completed|complete)$/i.test(column.title.trim()))
//         .map((column) => column.id);

//     const completed = tasks.filter((task) =>
//         completedColumnIds.includes(task.status)
//     ).length;

//     const remaining = tasks.length - completed;

//     const progress =
//         tasks.length > 0
//         ? Math.round((completed / tasks.length) * 100)
//         : 0;

//     if (isLoading) {
//         return (
//         <div className="p-6 text-sm text-gray-500">
//             Loading dashboard...
//         </div>
//         );
//     }

//     if (error && tasks.length === 0) {
//         return (
//         <div className="p-6 text-sm text-red-600">
//             Unable to load dashboard: {error}
//         </div>
//         );
//     }

//     return (
//         <main className="min-h-screen bg-gray-50 p-6 dark:bg-slate-950">
//         {/* Header */}
//         <div className="mb-8 flex items-center justify-between">
//             <div>
//             <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
//                 Dashboard
//             </h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
//                 Overview of your tasks and progress.
//             </p>
//             </div>

//             <Link
//             href="/board"
//             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//             >
//             Open Board
//             </Link>
//         </div>

//         {/* Summary */}
//         <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//             <SummaryCard title="Total Tasks" value={tasks.length} />
//             <SummaryCard title="Completed" value={completed} />
//             <SummaryCard title="Remaining" value={remaining} />
//         </section>

//         {/* Progress */}
//         <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
//             <div className="mb-3 flex items-center justify-between">
//             <h2 className="font-semibold text-gray-900 dark:text-white">
//                 Overall Progress
//             </h2>
//             <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
//                 {progress}%
//             </span>
//             </div>

//             <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
//             <div
//                 className="h-full rounded-full bg-blue-600 transition-all"
//                 style={{ width: `${progress}%` }}
//             />
//             </div>
//         </section>

//         {/* Column overview */}
//         <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
//             <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
//             Tasks by Status
//             </h2>

//             {columns.length === 0 ? (
//             <p className="text-sm text-gray-500">No columns available.</p>
//             ) : (
//             <div className="space-y-4">
//                 {columns.map((column) => {
//                 const count = tasks.filter(
//                     (task) => task.status === column.id
//                 ).length;

//                 return (
//                     <div key={column.id}>
//                     <div className="mb-1 flex justify-between text-sm">
//                         <span className="text-gray-700 dark:text-slate-300">
//                         {column.title}
//                         </span>
//                         <span className="text-gray-500 dark:text-slate-400">
//                         {count}
//                         </span>
//                     </div>

//                     <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800">
//                         <div
//                         className="h-2 rounded-full bg-blue-500"
//                         style={{
//                             width: `${
//                             tasks.length > 0
//                                 ? (count / tasks.length) * 100
//                                 : 0
//                             }%`,
//                         }}
//                         />
//                     </div>
//                     </div>
//                 );
//                 })}
//             </div>
//             )}
//         </section>

//         {/* Recent tasks */}
//         <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
//             <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-slate-800">
//             <h2 className="font-semibold text-gray-900 dark:text-white">
//                 Recent Tasks
//             </h2>

//             <Link
//                 href="/board"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
//             >
//                 View all
//             </Link>
//             </div>

//             {tasks.length === 0 ? (
//             <p className="p-6 text-sm text-gray-500 dark:text-slate-400">
//                 No tasks yet. Create your first task from the board.
//             </p>
//             ) : (
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm">
//                 <thead className="bg-gray-50 text-gray-500 dark:bg-slate-800/60 dark:text-slate-400">
//                     <tr>
//                     <th className="px-5 py-3 font-medium">Task</th>
//                     <th className="px-5 py-3 font-medium">Status</th>
//                     </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                     {[...tasks]
//                     .sort((a, b) => a.order - b.order)
//                     .slice(0, 5)
//                     .map((task) => {
//                         const status =
//                         columns.find(
//                             (column) => column.id === task.status
//                         )?.title ?? "Unknown";

//                         return (
//                         <tr key={task.id}>
//                             <td className="px-5 py-4 font-medium text-gray-800 dark:text-slate-200">
//                             {task.title}
//                             </td>
//                             <td className="px-5 py-4">
//                             <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-300">
//                                 {status}
//                             </span>
//                             </td>
//                         </tr>
//                         );
//                     })}
//                 </tbody>
//                 </table>
//             </div>
//             )}
//         </section>
//         </main>
//     );
//     }

//     function SummaryCard({
//     title,
//     value,
//     }: {
//     title: string;
//     value: number;
//     }) {
//     return (
//         <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
//         <p className="text-sm text-gray-500 dark:text-slate-400">
//             {title}
//         </p>
//         <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
//             {value}
//         </p>
//         </div>
//     );
// }
