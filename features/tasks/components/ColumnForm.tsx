"use client";
import React, { useState } from "react";
interface AddColumnFormProps {
    onAddColumn: (title: string) => Promise<boolean>;
}

export function ColumnForm({ onAddColumn }: AddColumnFormProps) {
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if(!trimmedTitle){
            setFormError("Column title cannot be empty.");
            return;
        }
        try{
            setIsSubmitting(true);
            setFormError("");
            const success = await onAddColumn(trimmedTitle);
            if(success){
                setTitle("");
            }else{
                setFormError("Failed to create column. Please try again.");
            }
        }catch(err){
            setFormError("An unexpected error occurred.");
        }finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-83 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label 
                        htmlFor="column-title" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Create New Column
                    </label>
                    <input id="column-title" type="text" value={title}
                        onChange={(e) => setTitle(e.target.value)} disabled={isSubmitting}
                        placeholder="Enter new status"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                    </div>

                    {formError && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {formError}
                    </p>
                    )}

                    <div className="flex justify-end gap-2">
                    <button type="submit" disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Adding..." : "Add Column"}
                    </button>
                </div>
            </form>
        </div>
    );
}