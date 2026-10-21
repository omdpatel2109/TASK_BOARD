import { authApi } from "@/lib/authUser";
import type {LoginCredentials, LoginResponse, SafeUser, UserType, UpdateUserData} from "@/features/auth/type/userType";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await authApi.post<LoginResponse>("/auth/login",{
      username: credentials.username.trim(),
      password: credentials.password,
    }
  );
  return response.data;
}

export async function getAuthenticatedUser(accessToken: string): Promise<SafeUser> {
  const response = await authApi.get<UserType>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const user = response.data;
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    image: user.image,
  };
}

//see if available this endpoint
export async function editUser(id: string | number, user: UpdateUserData, accessToken: string): Promise<UserType> {
  const response = await authApi.patch<UserType>(`/users/${id}`, user,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}