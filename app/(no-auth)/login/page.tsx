import "../../../styles/globals.css";

import { LoginForm } from "./LoginForm";

export default async function Login() {
  return (
    <div className="max-w-7xl min-h-screen mx-auto flex">
      <main className="flex-grow border-x-[0.2px] ml-[60px] sm:ml-[70px] md:ml-[100px] lg:ml-[250px] max-w-2xl border-zinc-700 p-10">
        <div className="container">
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome, Muskrat
          </h1>

          <p className="mt-2 text-center text-sm text-gray-600">
            {`To interact with other Muskrats, you'll need to sign-in with your
            email address. Don't worry, we don't actually care who you are, so
            you won't receive any email outside of ones you request.`}
          </p>

          <LoginForm />

          <p className="container font-xs text-gray text-center mx-auto items-center space-x-2 pt-10 justify-between">
            <span>{"This site is a parody."}</span>
            <span className="font-bold w-16 text-center">&middot;</span>
            <a href="https://github.com/dcramer/muskrats">GitHub</a>
          </p>
        </div>
      </main>
    </div>
  );
}
