import { redirect } from "next/navigation";
import { getServerSession } from "../../../lib/auth";
import SettingsForm from "./settings-form";

export default async function Settings() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        <h1 className="text-2xl font-bold ">Settings</h1>
      </div>

      <SettingsForm />
    </>
  );
}
