"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const className =
  "py-3 px-4 font-bold bg-gradient-to-r rounded-full text-xs bg-sky-600 hover:bg-sky-500 mx-auto disabled:cursor-not-allowed disabled:bg-gray";

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user!.email} <br />
        <button onClick={() => signOut()} className={className}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} className={className}>
        Sign in
      </button>
    </>
  );
}
