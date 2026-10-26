import * as yup from "yup";
export function getTodayLocalDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // "1" => "01"
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const addValidationSchema = yup.object({
    title: yup.string()
        .required("Title is required"),

    description: yup.string()
        .max(100, "Description must be less than 100 characters")
        .required("Description is required"),

    status: yup.string()
        .required("Status is required. Select the status"),

    priority: yup.string()
        .required("Priority is required. Select the priority."),

    dueDate: yup.string()
        .test("not-in-the-past", "Due date cannot be in the past",
            (value) => !value || value >= getTodayLocalDate()
        ),
});