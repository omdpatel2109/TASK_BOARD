"use client";
import { useFormik } from "formik";
import { useState } from "react";
import { addValidationSchema } from "../utils/addValidation";
import type {Task, TaskFormValues, TaskColumn, TaskPriority,} from "../type/taskType";
import { createTask, updateTask, getTasks } from "@/api/task";
import { getApiErrorMessage } from "@/lib/api";
import { getTodayLocalDate } from "../utils/addValidation";

interface TaskFormProps {
    task?: Task;
    columns: TaskColumn[];
    onSuccess: (task: Task) => void;
    onCancel: () => void;
}
const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];

export default function TaskForm({ task, columns, onSuccess, onCancel}: TaskFormProps) {
    const [apiError, setApiError] = useState("");
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const formik = useFormik<TaskFormValues>({
        initialValues: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            status: task?.status ?? "todo",
            priority: task?.priority ?? "medium",
            dueDate: task?.dueDate ?? "",
        },
        validationSchema: addValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try{
                setApiError("");
                const taskValues = {...values, dueDate: values.dueDate || null };
                if(task){
                    // Edit: preserve status unless the user changes it.
                    const updatedTask = await updateTask(task.id, {...taskValues, order: task.order});
                    onSuccess(updatedTask);
                }else{
                    // Create: always start in the To Do column.
                    const status = "todo";
                    const existingTasks = await getTasks();
                    const nextOrder = existingTasks.filter((item) => item.status === status)
                        .reduce((maxOrder, item) => Math.max(maxOrder, item.order),-1) + 1;

                    const createdTask = await createTask({...taskValues, status, order: nextOrder});
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
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-error">
                    {apiError}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-background dark:border-slate-700">
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-secondary-text dark:text-secondary-dark-text">
                        Title
                    </label>

                    <input type="text" placeholder="Enter title of task" id="title" name="title"
                        className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-primary-text placeholder-gray-400 transition-all focus:border-hover-primary focus:outline-none focus:ring-2 focus:ring-hover-primary"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.errors.title && formik.touched.title && (
                        <p className="mt-0 mb-2 text-xs font-medium text-error">
                            *{formik.errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-secondary-dark-text">
                        Description
                    </label>

                    <textarea placeholder="Enter description" rows={4}
                        id="description" name="description"
                        className="mt-1 mb-4 block w-full resize-none rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-primary-text placeholder-gray-400 transition-all focus:border-hover-primary focus:outline-none focus:ring-2 focus:ring-hover-primary"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.errors.description && formik.touched.description && (
                        <p className="mt-0 mb-2 text-xs font-medium text-error">
                            *{formik.errors.description}
                        </p>
                    )}
                </div>

                {/* Status is editable only for existing tasks. */}
                {task && (
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-secondary-dark-text">
                            Status
                        </label>

                        <select id="status" name="status"
                            className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-primary-text transition-all focus:border-hover-primary focus:outline-none focus:ring-2 focus:ring-hover-primary"
                            value={formik.values.status}
                            onChange={formik.handleChange}
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
                            <p className="mb-2 text-xs text-error">
                                Please create a column before editing a task.
                            </p>
                        )}

                        {formik.errors.status && formik.touched.status && (
                                <p className="mt-0 mb-2 text-xs font-medium text-error">
                                    *{formik.errors.status}
                                </p>
                            )}
                    </div>
                )}

                {/* Priority is available when creating and editing. */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-secondary-dark-text">
                        Priority
                    </label>
                    <select id="priority" name="priority"
                        className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-primary-text transition-all focus:border-hover-primary focus:outline-none focus:ring-2 focus:ring-hover-primary"
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                        {PRIORITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {formik.errors.priority && formik.touched.priority && (
                        <p className="mt-0 mb-2 text-xs font-medium text-error">
                            *{formik.errors.priority}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 dark:text-secondary-dark-text">
                        Due Date
                    </label>

                    <input type="date" id="dueDate" name="dueDate"
                        min={getTodayLocalDate()}
                        value={formik.values.dueDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-primary-text transition-all focus:border-hover-primary focus:outline-none focus:ring-2 focus:ring-hover-primary"
                    />

                    {formik.errors.dueDate && formik.touched.dueDate && (
                        <p className="mt-0 mb-2 text-xs font-medium text-error">
                            *{formik.errors.dueDate}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                    <button type="button" onClick={onCancel}
                        className="w-1/2 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button type="submit" disabled={formik.isSubmitting ||
                            (task !== undefined && sortedColumns.length === 0)
                        }
                        className="w-1/2 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-hover-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {formik.isSubmitting ? task ? "Updating..." : "Adding..."
                            : task ? "Update Task" : "Add Task"}
                    </button>
                </div>
            </form>
        </>
    );
}