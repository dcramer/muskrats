"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Profile from "./profile";
import { useRouter } from "next/router";

/* eslint-disable @next/next/no-img-element */
export default function PostInput() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleTweetSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setbtnloading(true);

    const post = {
      content,
      image: selectedFile,
    };

    const res = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify(post),
    });

    if (res.status === 201) {
      console.log("Post successfully created.");
      res.json().then((d) => console.log(d));
    } else {
      console.log("Something went wrong.");
    }

    setContent("");
    setSelectedFile(null);
    setbtnloading(false);

    document && document.location.reload();
    // router.push("/");
  };

  const canSubmit =
    (content.length > 0 && content.trim() !== "") || selectedFile;

  return (
    <div className="p-3 border-b border-zinc-700">
      <div className="flex space-x-3">
        <Profile />
        <form
          onSubmit={handleTweetSubmit}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className="bg-transparent focus:outline-none flex-1 py-4"
            placeholder="What's Happening?"
          />
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={addImage}
          />
          <button
            onClick={() => {
              inputRef.current?.click();
            }}
            title="Add Image"
            type="button"
            className=" hover:bg-gray-200 hover:bg-opacity-10 text-sky-600 rounded-full"
          >
            <PhotoIcon className="w-10 h-10 p-2" />
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="py-3 px-4 font-bold bg-gradient-to-r rounded-full text-xs bg-sky-600 hover:bg-sky-500 mx-auto disabled:cursor-not-allowed disabled:bg-gray"
          >
            {btnloading ? "..." : "Post"}
          </button>
        </form>
      </div>
      {selectedFile && (
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
          <img src={selectedFile} alt="" className="rounded-3xl  opacity-70" />
        </div>
      )}
    </div>
  );
}
