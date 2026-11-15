
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { STATUS_OPTIONS, createStatus } from "../types/statusOptions";
import type {
    Workflow,
    WorkflowStatus,
    CreateWorkflow,
    UpdateWorkflow,
} from "../types/workflowType";

import { getCurrentUser } from "@/features/auth/action";

interface WorkflowFormProps {
    editingWorkflow: Workflow | null;
    onClose: () => void;
    onCreate: (workflow: CreateWorkflow) => Promise<Workflow>;
    onUpdate: (id: string, data: UpdateWorkflow) => Promise<Workflow>;
    onSaved: (isNew: boolean) => void;
}

export default function WorkflowForm({
    editingWorkflow,
    onClose,
    onCreate,
    onUpdate,
    onSaved,
}: WorkflowFormProps) {
    const [name, setName] = useState(editingWorkflow?.name ?? "");
    const [description, setDescription] = useState(
        editingWorkflow?.description ?? ""
    );

    const [statuses, setStatuses] = useState<WorkflowStatus[]>(
        editingWorkflow
            ? [...editingWorkflow.statuses].sort(
                  (a, b) => a.order - b.order
              )
            : []
    );

    const [customStatus, setCustomStatus] = useState("");
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Select or deselect predefined status
    function toggleStatus(title: string) {
        const existing = statuses.find(
            (status) => status.title === title
        );

        if (existing) {
            setStatuses((prev) =>
                prev
                    .filter((status) => status.title !== title)
                    .map((status, index) => ({
                        ...status,
                        order: index,
                    }))
            );
            return;
        }

        const option = STATUS_OPTIONS.find(
            (item) => item.title === title
        );

        if (!option) return;

        setStatuses((prev) => [
            ...prev,
            createStatus(
                option.title,
                option.isStart,
                option.isCompleted,
                prev.length
            ),
        ]);
    }

    // Add custom status
    function addCustomStatus() {
        const value = customStatus.trim();

        if (!value) return;

        if (
            statuses.some(
                (status) =>
                    status.title.toLowerCase() === value.toLowerCase()
            )
        ) {
            setFormError("This status already exists.");
            return;
        }

        setStatuses((prev) => [
            ...prev,
            createStatus(value, false, false, prev.length),
        ]);

        setCustomStatus("");
        setFormError("");
    }

    // Remove status
    function removeStatus(id: string) {
        setStatuses((prev) =>
            prev
                .filter((status) => status.id !== id)
                .map((status, index) => ({
                    ...status,
                    order: index,
                }))
        );
    }

    // Save workflow
    async function handleSubmit() {
        setFormError("");

        if (!name.trim()) {
            setFormError("Workflow name is required.");
            return;
        }

        if (statuses.length === 0) {
            setFormError("Select at least one status.");
            return;
        }

        if (statuses.filter((item) => item.isStart).length !== 1) {
            setFormError("Select exactly one starting status.");
            return;
        }

        if (statuses.filter((item) => item.isCompleted).length !== 1) {
            setFormError("Select exactly one completed status.");
            return;
        }

        try {
            setIsSaving(true);

            if (editingWorkflow) {
                await onUpdate(editingWorkflow.id, {
                    name: name.trim(),
                    description: description.trim(),
                    statuses,
                });

                onSaved(false);
            } else {
                const user = await getCurrentUser();

                if (!user) {
                    setFormError("Please log in again.");
                    return;
                }

                await onCreate({
                    name: name.trim(),
                    description: description.trim(),
                    userId: user.id,
                    statuses,
                });

                onSaved(true);
            }

            onClose();
        } catch {
            setFormError("Unable to save workflow. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">

                <h2 className="text-2xl font-semibold text-primary-text dark:text-white">
                    {editingWorkflow ? "Edit Workflow" : "Create Workflow"}
                </h2>

                <div className="mt-6 space-y-5">

                    {/* Workflow Name */}
                    <div>
                        <label className="mb-2 block text-base font-semibold">
                            Workflow Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Software Development"
                            className="w-full rounded-lg border border-slate-300 p-3 text-base dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-base font-semibold">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this workflow"
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 p-3 text-base dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    {/* Predefined Statuses */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">
                            Choose Statuses
                        </h3>

                        <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map((option) => {
                                const selected = statuses.some(
                                    (item) => item.title === option.title
                                );

                                return (
                                    <button
                                        key={option.title}
                                        type="button"
                                        onClick={() => toggleStatus(option.title)}
                                        className={`rounded-lg border p-3 text-left text-base ${
                                            selected
                                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950"
                                                : "border-slate-200 dark:border-slate-700"
                                        }`}
                                    >
                                        {selected ? "✓ " : "+ "}
                                        {option.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Status */}
                    <div>
                        <label className="mb-2 block text-base font-semibold">
                            Add Custom Status
                        </label>

                        <div className="flex gap-2">
                            <input
                                value={customStatus}
                                onChange={(e) => setCustomStatus(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addCustomStatus();
                                    }
                                }}
                                placeholder="e.g. Client Approval"
                                className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3 text-base dark:border-slate-700 dark:bg-slate-800"
                            />

                            <button
                                type="button"
                                onClick={addCustomStatus}
                                className="flex items-center gap-1 rounded-lg bg-slate-800 px-4 text-base font-medium text-white"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Selected Statuses */}
                    {statuses.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-lg font-semibold">
                                Selected Statuses
                            </h3>

                            <div className="space-y-2">
                                {[...statuses]
                                    .sort((a, b) => a.order - b.order)
                                    .map((status) => (
                                        <div
                                            key={status.id}
                                            className="flex items-center justify-between rounded-lg bg-slate-100 p-3 text-base dark:bg-slate-800"
                                        >
                                            <span>{status.title}</span>

                                            <button
                                                type="button"
                                                onClick={() => removeStatus(status.id)}
                                                className="text-sm font-medium text-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Form Error */}
                    {formError && (
                        <p className="text-base text-red-500">
                            {formError}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-lg border px-5 py-2.5 text-base disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Workflow"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
