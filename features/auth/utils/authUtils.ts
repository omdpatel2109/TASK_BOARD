import * as yup from "yup";

export const validationSchema = yup.object({
    username: yup.string().required("username is required"),
    
    password: yup.string().min(6, "Password must be at least 6 characters")
        .required("Password is required"),
})

