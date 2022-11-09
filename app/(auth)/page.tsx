import { redirect } from "next/navigation";
import { getServerSession } from "../../lib/auth";
import RealtimeFeed from "./realtime-feed";

export const dynamic = "force-dynamic";
export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        <h1 className="text-2xl font-bold ">Home</h1>
      </div>

      <RealtimeFeed userId={session.user.id} showNewPost />
    </>
  );
}
