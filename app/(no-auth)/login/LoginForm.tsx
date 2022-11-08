"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    signIn("email", {
      email: e.currentTarget.email.value,
      redirect: true,
      callbackUrl: "/",
    }).finally(() => setIsLoading(false));
  };

  console.log(isLoading);

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Email address"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 hover:bg-sky-500 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-sky-500 group-hover:text-sky-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              />
            </svg>
          </span>
          {isLoading ? "Sending link..." : "Send me a link!"}
        </button>
      </div>
    </form>
  );
};
