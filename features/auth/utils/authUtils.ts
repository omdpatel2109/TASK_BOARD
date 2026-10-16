import * as yup from "yup";

export const validationSchema = yup.object({
    username: yup.string().required("username is required"),
    
    password: yup.string().min(6, "Password must be at least 6 characters")
        .required("Password is required"),
})


export const registerValidationSchema = yup.object({
    name: yup.string()
        .trim()
        .required("Name is required"),
    email: yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
})