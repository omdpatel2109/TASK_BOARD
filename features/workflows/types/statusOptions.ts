
import type { WorkflowStatus } from "./workflowType";

export const STATUS_OPTIONS = [
    {
        title: "Backlog",
        isStart: true,
        isCompleted: false,
    },
    {
        title: "Todo",
        isStart: true,
        isCompleted: false,
    },
    {
        title: "In Progress",
        isStart: false,
        isCompleted: false,
    },
    {
        title: "In Review",
        isStart: false,
        isCompleted: false,
    },
    {
        title: "Testing",
        isStart: false,
        isCompleted: false,
    },
    {
        title: "On Hold",
        isStart: false,
        isCompleted: false,
    },
    {
        title: "Done",
        isStart: false,
        isCompleted: true,
    },
    {
        title: "Completed",
        isStart: false,
        isCompleted: true,
    },
];

export function createStatus(
    title: string,
    isStart = false,
    isCompleted = false,
    order = 0
): WorkflowStatus {
    return {
        id: crypto.randomUUID(),
        title: title.trim(),
        order,
        isStart,
        isCompleted,
    };
}
