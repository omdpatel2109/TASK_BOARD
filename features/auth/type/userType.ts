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

//after user login, the require information for ui
export interface SafeUser {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface LoginResponse extends UserType {
  accessToken: string;
}