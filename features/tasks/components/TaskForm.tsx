import { useFormik } from "formik";
import { addValidationSchema } from "../utils/addValidation";
import type {Task, TaskFormValues,} from "../type/taskType";
import {createTask, updateTask} from "@/api/task";

interface TaskFormProps {
    task?: Task;
    onSuccess: (task: Task) => void;
    onCancel: () => void;
}

export default function TaskForm({task, onSuccess, onCancel}: TaskFormProps) {

    const formik = useFormik<TaskFormValues>({
        enableReinitialize: true,
        initialValues: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            status: task?.status ?? "todo"
        },

        validationSchema: addValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try{
                if(task){
                    // EDIT
                    const updatedTask = await updateTask(task.id, values);
                    onSuccess(updatedTask);
                }else{
                    // ADD
                    const createdTask = await createTask(values);
                    onSuccess(createdTask);
                }
            }catch(error){
                console.error("Failed to save task:", error);
            }finally{
                setSubmitting(false);
            }
        }
    });

    return(
        <form onSubmit={formik.handleSubmit}
            className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Title
                </label>

                <input type="text" placeholder="Enter title of task" id="title" name="title"
                    className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />

                {formik.errors.title && formik.touched.title ? (
                    <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                        *{formik.errors.title}
                    </p>
                ) : null}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Description
                </label>

                <textarea placeholder="Enter description" rows={4} id="description"
                    name="description"
                    className="mt-1 mb-4 block w-full resize-none rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />

                {formik.errors.description && formik.touched.description ? (
                    <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                        *{formik.errors.description}
                    </p>
                ) : null}
            </div>

            {/* Status */}
            <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                    Status
                </label>

                <select id="status" name="status"
                    className="mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="todo"> To Do </option>
                    <option value="in_progress"> In Progress </option>
                    <option value="done">  Done </option>
                </select>

                {formik.errors.status && formik.touched.status ? (
                    <p className="mt-0 mb-2 text-xs font-medium text-red-500">
                        *{formik.errors.status}
                    </p>
                ) : null}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
                <button type="button" onClick={onCancel}
                    className="w-1/2 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button type="submit" disabled={formik.isSubmitting}
                    className="w-1/2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {formik.isSubmitting ? (task ? "Updating..." : "Adding...") : (task ? "Update Task" : "Add Task")}
                </button>
            </div>
        </form>
    );
}