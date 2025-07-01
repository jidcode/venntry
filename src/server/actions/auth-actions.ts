"use server";

import { cookies } from "next/headers";
import api from "../api/axios";
import { AppError, handleApiError } from "@/core/lib/errors";
import { LoginRequest, RegisterRequest } from "@/core/schema/validator";

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: AppError;
}

export const RegisterUserAction = async (
  formData: RegisterRequest
): Promise<ActionResult> => {
  try {
    const response = await api.post("/auth/register", formData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const LoginUserAction = async (
  formData: LoginRequest
): Promise<ActionResult> => {
  try {
    const response = await api.post("/auth/login", formData, {
      withCredentials: true,
    });

    const token = response.data.token;

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const LogoutUserAction = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { message: "User logged out." };
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};
