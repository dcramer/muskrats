import { redirect } from "next/navigation";
import { getServerSession } from "../../../lib/auth";

export default async function Messages() {
  const session = await getServerSession();
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
