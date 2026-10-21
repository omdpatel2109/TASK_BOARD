// "use client";
// import { useRef, useState } from "react";
// import { Camera, UserRound, X } from "lucide-react";
// import {updateUserProfile} from "@/api/auth";

// export default function EditProfile() {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [photo, setPhoto] = useState<string | null>(null);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [file, setFile] = useState<File | null>(null);

//     const fileInputRef = useRef<HTMLInputElement>(null);

//     function handlePhotoChange(
//         event: React.ChangeEvent<HTMLInputElement>
//     ) {
//         const selectedFile = event.target.files?.[0];

//         setError("");
//         setSuccess("");

//         if (!selectedFile) return;

//         if (!selectedFile.type.startsWith("image/")) {
//             setError("Please select a valid image.");
//             event.target.value = "";
//             return;
//         }

//         if (selectedFile.size > 5 * 1024 * 1024) {
//             setError("Image size must be less than 5 MB.");
//             event.target.value = "";
//             return;
//         }

//         if (photo) URL.revokeObjectURL(photo);

//         setPhoto(URL.createObjectURL(selectedFile));
//         setFile(selectedFile);
//     }

//     function handleCancel() {
//         setFirstName("");
//         setLastName("");
//         setError("");
//         setSuccess("");

//         if (photo) URL.revokeObjectURL(photo);

//         setPhoto(null);
//         setFile(null);

//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     }

//     function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//         event.preventDefault();
//         setError("");
//         setSuccess("");

//         if (!firstName.trim() || !lastName.trim()) {
//             setError("Please enter both your first and last name.");
//             return;
//         }

//         // Connect your profile update API here.
//         // `file` contains the selected image, if any.
//         console.log({
//             firstName: firstName.trim(),
//             lastName: lastName.trim(),
//             profilePhoto: file,
//         });

//         setSuccess(
//             "Form validated. Connect your profile API to save these changes."
//         );
//     }

//     return (
//         <section className="mx-auto w-full max-w-2xl p-4 sm:p-6">
//             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//                 <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
//                     <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
//                         Edit Profile
//                     </h2>
//                     <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                         Update your personal information and profile photo.
//                     </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6 p-6">
//                     {/* Profile photo */}
//                     <div className="flex items-center gap-5">
//                         <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
//                             {photo ? (
//                                 <img
//                                     src={photo}
//                                     alt="Profile preview"
//                                     className="h-full w-full object-cover"
//                                 />
//                             ) : (
//                                 <UserRound
//                                     size={34}
//                                     className="text-slate-400"
//                                 />
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
//                                 Profile photo
//                             </p>

//                             <div className="flex flex-wrap gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         fileInputRef.current?.click()
//                                     }
//                                     className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
//                                 >
//                                     <Camera size={16} />
//                                     Upload photo
//                                 </button>

//                                 {photo && (
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             URL.revokeObjectURL(photo);
//                                             setPhoto(null);
//                                             setFile(null);
//                                             if (fileInputRef.current) {
//                                                 fileInputRef.current.value = "";
//                                             }
//                                         }}
//                                         className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
//                                     >
//                                         <X size={16} />
//                                         Remove
//                                     </button>
//                                 )}
//                             </div>

//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                                 Image format, maximum 5 MB.
//                             </p>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handlePhotoChange}
//                                 className="hidden"
//                             />
//                         </div>
//                     </div>

//                     {/* First name */}
//                     <div className="space-y-2">
//                         <label
//                             htmlFor="firstName"
//                             className="block text-sm font-medium text-slate-700 dark:text-slate-300"
//                         >
//                             First name
//                         </label>
//                         <input
//                             id="firstName"
//                             type="text"
//                             autoComplete="given-name"
//                             value={firstName}
//                             onChange={(event) => {
//                                 setFirstName(event.target.value);
//                                 setError("");
//                                 setSuccess("");
//                             }}
//                             placeholder="Enter your first name"
//                             maxLength={50}
//                             required
//                             className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
//                         />
//                     </div>

//                     {/* Last name */}
//                     <div className="space-y-2">
//                         <label
//                             htmlFor="lastName"
//                             className="block text-sm font-medium text-slate-700 dark:text-slate-300"
//                         >
//                             Last name
//                         </label>
//                         <input
//                             id="lastName"
//                             type="text"
//                             autoComplete="family-name"
//                             value={lastName}
//                             onChange={(event) => {
//                                 setLastName(event.target.value);
//                                 setError("");
//                                 setSuccess("");
//                             }}
//                             placeholder="Enter your last name"
//                             maxLength={50}
//                             required
//                             className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
//                         />
//                     </div>

//                     {/* Feedback */}
//                     {error && (
//                         <p
//                             role="alert"
//                             className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
//                         >
//                             {error}
//                         </p>
//                     )}

//                     {success && (
//                         <p
//                             role="status"
//                             className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
//                         >
//                             {success}
//                         </p>
//                     )}

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
//                         <button
//                             type="button"
//                             onClick={handleCancel}
//                             className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         >
//                             Save Changes
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </section>
//     );
// }