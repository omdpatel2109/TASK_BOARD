// "use client";

// import { useState } from "react";
// import { UserRound, Upload } from "lucide-react";
// import { editUser } from "@/api/auth";
// import type { UserType, UpdateUserData } from "@/features/auth/type/userType";

// interface EditProfileProps {
//   user: UserType;
//   accessToken: string;
// }

// export default function EditProfile({
//   user,
//   accessToken,
// }: EditProfileProps) {
//   const [formData, setFormData] = useState<UpdateUserData>({
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     image: user.image,
//   });

//   const [updatedUser, setUpdatedUser] = useState<UserType>(user);
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];

//     if (file) {
//       const imageUrl = URL.createObjectURL(file);

//       setFormData((prev) => ({
//         ...prev,
//         image: imageUrl,
//       }));
//     }
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");

//     try {
//       const result = await editUser(user.id, formData, accessToken);

//       setUpdatedUser(result);
//       setFormData({
//         firstName: result.firstName,
//         lastName: result.lastName,
//         email: result.email,
//         image: result.image,
//       });

//       setMessage("Profile updated successfully!");
//     } catch {
//       setMessage("Failed to update profile. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
//         Edit Profile
//       </h1>
//       <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
//         Update your personal information.
//       </p>

//       <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//         {/* Profile Picture */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
//             Profile Picture
//           </label>

//           <div className="flex items-center gap-4">
//             <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
//               {formData.image ? (
//                 <img
//                   src={formData.image}
//                   alt="Profile preview"
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <UserRound size={36} className="text-gray-400" />
//               )}
//             </div>

//             <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
//               <Upload size={16} />
//               Upload Photo
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         </div>

//         {/* First Name */}
//         <div>
//           <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
//             First Name
//           </label>
//           <input
//             id="firstName"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
//           />
//         </div>

//         {/* Last Name */}
//         <div>
//           <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
//             Last Name
//           </label>
//           <input
//             id="lastName"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
//           />
//         </div>

//         {/* Message */}
//         {message && (
//           <p
//             role="status"
//             className={`text-sm ${
//               message.startsWith("Profile updated")
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {message}
//           </p>
//         )}

//         {/* Save Button */}
//         <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-slate-800">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {isLoading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </form>

//       {/* Updated Profile Preview */}
//       <div className="mt-6 border-t border-gray-100 pt-5 dark:border-slate-800">
//         <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">
//           Current Profile
//         </h2>

//         <div className="flex items-center gap-3">
//           {updatedUser.image ? (
//             <img
//               src={updatedUser.image}
//               alt="Updated profile"
//               className="h-12 w-12 rounded-full object-cover"
//             />
//           ) : (
//             <UserRound size={36} />
//           )}

//           <div>
//             <p className="font-medium text-gray-900 dark:text-white">
//               {updatedUser.firstName} {updatedUser.lastName}
//             </p>
//             <p className="text-sm text-gray-500 dark:text-slate-400">
//               {updatedUser.email}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
