import Logo from "@/core/components/elements/logo";
import Link from "next/link";
import RegisterForm from "../_components/register-form";

const RegisterPage = () => {
  return (
    <div className="flex min-h-full text-secondary/90 flex-col justify-center px-6 py-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="grid place-content-center">
          <Logo />
        </div>

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RegisterForm />

        <p className="mt-10 text-center text-sm">
          Already have an account?
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline ml-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
