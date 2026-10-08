import * as yup from "yup";

export const addValidationSchema = yup.object({
    title: yup.string().required("Title is required"),
    
    description: yup.string().max(100, "Description must be less than 100 characters")
        .required("Description is required"),

    status: yup.string().required("Status is required. Select the status")
        .oneOf(['todo', 'in_progress', 'done'])
})