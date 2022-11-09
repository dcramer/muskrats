"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export default function SettingsForm() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [btnloading, setbtnloading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const router = useRouter();

  const addImage = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files![0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setbtnloading(true);

    const post = {
      image: selectedFile,
    };

    const res = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(post),
    });

    setbtnloading(false);
    if (res.status === 201) {
      console.log("Settings saved.");
      res.json().then((d) => console.log(d));
      setSelectedFile(null);
      router.push("/");
    } else {
      console.log("Something went wrong.");
    }
  };

  const canSubmit = !!selectedFile;

  return (
    <form onSubmit={handleSave}>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 px-4 py-5 sm:p-6">
          <div>
            <label className="block text-base font-bold text-gray">
              Username
            </label>
            <p>{`elonmusk#${session.user?.id}`}</p>
          </div>
        </div>
        <div className="space-y-6 px-4 py-5 sm:p-6">
          <div>
            <label className="block text-base font-bold text-gray">
              Avatar
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray">
                <img
                  src={`/api/users/me/avatar`}
                  className="w-14 h-14 rounded-full"
                  width={32}
                  height={32}
                  alt="Profile Pic"
                />
              </span>
              <div
                className="ml-5 rounded-md border border-gray bg-white py-2 px-3 text-sm font-medium leading-4 text-gray shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                <span>Change</span>
                <input
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  onChange={addImage}
                />
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="sr-only"
                />
              </div>
            </div>

            {!!selectedFile && (
              <div className="p-2 mt-4 relative">
                <p className="absolute text-4xl top-1/2 left-1/2 -translate-x-1/2">
                  PREVIEW
                </p>
                <span
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                  className="text-xl  absolute top-[20px] left-[30px] z-20 cursor-pointer"
                >
                  &times;
                </span>
                <img
                  src={selectedFile}
                  alt=""
                  className="rounded-3xl  opacity-70"
                />
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            disabled={!canSubmit}
            className="py-2 px-4 font-bold bg-gradient-to-r rounded-full text-xs bg-sky-600 hover:bg-sky-500 mx-auto disabled:cursor-not-allowed disabled:bg-gray"
          >
            {btnloading ? "..." : "Save"}
          </button>{" "}
        </div>
      </div>
    </form>
  );
}
