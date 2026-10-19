"use client";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "../action";

export default function useAuth() {
  const router = useRouter();
  const login = async (username: string, password: string) => {
    const result = await loginAction(username, password);

    if (result.success) {
      router.push("/board");
      router.refresh();
    }

    return result;
  };

  const logout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return { login, logout };
}