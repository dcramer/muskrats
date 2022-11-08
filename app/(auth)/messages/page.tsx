import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Messages() {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <p className="mt-8 text-center text-sm text-gray-600">
        Yeah right we have other things to do.
      </p>
    </>
  );
}
