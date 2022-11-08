import { getCsrfToken } from "next-auth/react";
import Head from "next/head";

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

export default function Login({ csrfToken }: any) {
  return (
    <div className="max-w-7xl min-h-screen mx-auto flex">
      <Head>
        <title>Login / Muskrat.club</title>
      </Head>
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
          <form
            className="mt-8 space-y-6"
            action="/api/auth/signin/email"
            method="POST"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

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
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 hover:bg-sky-500 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                      fill-rule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Send me a link!
              </button>
            </div>
          </form>

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
