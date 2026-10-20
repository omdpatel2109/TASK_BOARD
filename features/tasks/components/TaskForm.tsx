"use client";
import { useFormik } from "formik";
import { useState } from "react";
import { addValidationSchema } from "../utils/addValidation";
import type { Task, TaskFormValues, TaskColumn } from "../type/taskType";
import { createTask, updateTask, getTasks } from "@/api/task";
import { getApiErrorMessage } from "@/lib/api";
interface TaskFormProps {
    task?: Task;
    columns: TaskColumn[];
    onSuccess: (task: Task) => void;
    onCancel: () => void;
}

export default function TaskForm({task, columns, onSuccess, onCancel}: TaskFormProps) {
    const [apiError, setApiError] = useState("");
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const formik = useFormik<TaskFormValues>({
    initialValues: {
        title: task?.title ?? "",
        description: task?.description ?? "",
        status: task?.status ??
        "todo",
    },
    validationSchema: addValidationSchema,

    onSubmit: async (values, { setSubmitting }) => {
        try{
            setApiError("");
            if(task){
            // EDIT TASK
                const updatedTask = await updateTask(task.id, {...values, order: task.order,});
                onSuccess(updatedTask);
            }else{
            // ADD NEW TASK
                const existingTasks = await getTasks();
                const nextOrder = existingTasks
                    .filter((item) => item.status === values.status)
                    .reduce((maxOrder, item) => Math.max(maxOrder, item.order),-1) + 1;

                const createdTask = await createTask({...values,order: nextOrder});
                onSuccess(createdTask);
            }
        }catch(error){
            console.error("Failed to save task:", error);
            setApiError(getApiErrorMessage(error));
        }finally{
            setSubmitting(false);
        } 
    },
});

    return (
    <>
        {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {apiError}
        </div>
        )}

        <form onSubmit={formik.handleSubmit}
        className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Title
                </label>
                <input type="text" placeholder="Enter title of task" id="title" name="title"
                className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formik.values.title} onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />

                {formik.errors.title && formik.touched.title && (
                <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                *{formik.errors.title}
                </p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Description
                </label>
                <textarea placeholder="Enter description" rows={4} id="description" name="description"
                className="mt-1 mb-4 block w-full resize-none rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formik.values.description} onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />

                {formik.errors.description && formik.touched.description && (
                <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                *{formik.errors.description}
                </p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                    Status
                </label>
                <select id="status" name="status"
                className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formik.values.status} onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={sortedColumns.length === 0}
                >
                {sortedColumns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.title}
                    </option>
                ))}
                </select>

                {sortedColumns.length === 0 && (
                <p className="mb-2 text-xs text-red-500">
                    Please create a column before adding a task.
                </p>
                )}

                {formik.errors.status && formik.touched.status && (
                <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                *{formik.errors.status}
                </p>
                )} 
            </div>

            <div className="mt-4 flex gap-2">
                <button type="button" onClick={onCancel}
                className="w-1/2 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button type="submit" disabled={formik.isSubmitting || sortedColumns.length === 0}
                className="w-1/2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                > 
                {formik.isSubmitting ? (task ? "Updating..." : "Adding...") : (task ? "Update Task" : "Add Task")}
                </button>
            </div>
        </form>
    </>
    );
}