"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { LoginRequest, loginSchema } from "@/core/schema/validator";
import { useAuthStore } from "@/core/stores/auth-store";
import useInventoryStore from "@/core/stores/inventory-store";
import { LoginUserAction } from "@/server/actions/auth-actions";
import { Label } from "@/core/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore.getState().setUser;
  const setInventory = useInventoryStore.getState().setCurrentInventory;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const action: SubmitHandler<LoginRequest> = async (data) => {
    setServerError(null);

    try {
      const response = await LoginUserAction(data);

      if (response.success) {
        const { userId, userName, email, avatar, inventories } = response.data;

        setUser({
          id: userId,
          username: userName,
          email,
          avatar,
          inventories,
        });

        if (inventories && inventories.length > 0) {
          setInventory(inventories[0]);
        }

        router.push("/dashboard");
      } else if (response.error) {
        setServerError(response.error.message || "login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <form className="space-y-6 px-8 lg:px-2" onSubmit={handleSubmit(action)}>
      {serverError && (
        <div className="text-red-500 bg-red-50 p-2 rounded text-center">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          rightIcon={<MailIcon className="h-4 w-4" />}
          iconPosition="right"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          type="password"
          id="password"
          rightIcon={<LockIcon className="h-4 w-4" />}
          iconPosition="right"
          {...register("password")}
          disabled={isSubmitting}
        />

        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting && serverError === null ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Signing in...</p>
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
