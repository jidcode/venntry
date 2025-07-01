"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, LockIcon, MailIcon, User2 } from "lucide-react";
import { RegisterRequest, registerSchema } from "@/core/schema/validator";
import { Button } from "@/core/components/ui/button";
import { RegisterUserAction } from "@/server/actions/auth-actions";
import { Label } from "@/core/components/ui/label";
import { Input } from "@/core/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const action: SubmitHandler<RegisterRequest> = async (data) => {
    setServerError(null);

    try {
      const response = await RegisterUserAction(data);

      if (response.success) {
        router.push("/login");
        reset();
      } else if (response.error) {
        setServerError(response.error.message || "Registration failed");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <form className="space-y-6 px-8 lg:px-0" onSubmit={handleSubmit(action)}>
      {serverError && (
        <div className="text-red-500 bg-red-50 p-2 rounded text-center">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          type="username"
          id="username"
          rightIcon={<User2 className="h-4 w-4" />}
          iconPosition="right"
          {...register("username")}
          disabled={isSubmitting}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>

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
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Registering...</p>
          </div>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
}
