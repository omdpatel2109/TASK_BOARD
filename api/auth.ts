import { authApi } from "@/lib/authUser";
import type {LoginCredentials, LoginResponse, SafeUser, UserType} from "@/features/auth/type/userType";

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
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
  };
}