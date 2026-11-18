"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow} from "@/api/workflowApi";
import type { Workflow, CreateWorkflow, UpdateWorkflow } from "../types/workflowType";
import { getCurrentUser } from "@/features/auth/action";

//this is for which user is logged in so the related workflows are shown 
const getStorageKey = (userId: number) => `active-workflow-${userId}`;

export function useWorkflows() {
    const router = useRouter();
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    //identify the logged in user and then Fetch that user's workflows
    const loadWorkflows = useCallback(async () => {
        try{
            setIsLoading(true);
            setError("");
            const user = await getCurrentUser();
            if(!user){
                router.push("/login");
                return;
            }
            const data = await getWorkflows(user.id);
            setWorkflows(data);

            //when user close the browser & then reopen then it open the last selected workflow
            const savedId = localStorage.getItem(getStorageKey(user.id));
            const selected = data.find((item) => item.id === savedId) ?? data[0] ?? null;
            setActiveWorkflow(selected);
            if(selected){
                localStorage.setItem(getStorageKey(user.id), selected.id);
            }
        }catch(err){
            console.error("Workflow loading failed:", err);
            setError("Unable to load workflows.");
        }finally{
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        void loadWorkflows();
    }, [loadWorkflows]);

    //function for selecting the workflow
    const selectWorkflow = (workflow: Workflow) => {
        setActiveWorkflow(workflow);
        localStorage.setItem(getStorageKey(workflow.userId), workflow.id);
        router.push("/tasks");
    };

    const addWorkflow = async (workflow: CreateWorkflow) => {
        const created = await createWorkflow(workflow);
        setWorkflows((prev) => [...prev, created]);
        return created;
    };

    const editWorkflow = async ( id: string, data: UpdateWorkflow) => {
        const updated = await updateWorkflow(id, data);
        setWorkflows((prev) => prev.map((item) => item.id === id ? updated : item));
        setActiveWorkflow((prev) => prev?.id === id ? updated : prev);
        return updated;
    };

    const removeWorkflow = async (id: string) => {
        await deleteWorkflow(id);

        setWorkflows((prev) => prev.filter((item) => item.id !== id));
        setActiveWorkflow((prev) => prev?.id === id ? null : prev);
    };

    return {workflows, activeWorkflow, isLoading, error, loadWorkflows,
        selectWorkflow, addWorkflow, editWorkflow, removeWorkflow
    };
}