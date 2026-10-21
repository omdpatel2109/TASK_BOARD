export interface UserType {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
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
  firstName: string;
  lastName: string;
  name: string;
  image: string;
}

export interface LoginResponse extends UserType {
  accessToken: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}