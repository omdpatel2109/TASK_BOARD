export interface UserType {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SafeUser {
  id: number;
  username: string;
  email: string;
  name: string;
  image?: string;
}

export interface LoginResponse extends UserType {
  accessToken: string;
  refreshToken: string;
}