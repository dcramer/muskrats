"use client";

import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Profile from "./profile";
import { Post as PostType } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import moment from "moment";
import PostContent from "./post-content";

type Props = {
  parent?: PostType | null;
  hidden: boolean;
  setParent: any;
};

const MAX_LENGTH = 275;

const ParentPost = ({ post }: { post: PostType }) => {
  const username = `elonmusk#${post.authorId}`;
  return (
    <div className="py-4 px-4 cursor-pointer hover:bg-gray-600 hover:bg-opacity-30">
      <div className="flex items-start justify-stretch space-x-3">
        <img
          src={`/api/users/${post.authorId}/avatar`}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full w-7 h-7 sm:h-10 sm:w-10"
        />
        <div className="flex flex-col space-y-0 text-base flex-1">
          <div className="flex space-x-2 items-center">
            <div className="font-semibold hover:underline flex">
              <Link href={`/${encodeURIComponent(username)}`} className="flex">
                {"Elon Musk"}
                <CheckBadgeIcon className={`text-white-600 w-5 h-5`} />
              </Link>
            </div>
            <div className="text-base font-light">@{username}</div>
            <span className="font-bold">&middot;</span>

            <div className="text-base text-gray hover:underline">
              <Link href={`/${encodeURIComponent(username)}/status/${post.id}`}>
                {moment(post.createdAt).fromNow()}
              </Link>
            </div>
          </div>
          {post.content && (
            <div className="text-base text-justify whitespace-pre-line">
              <PostContent value={post.content} />
            </div>
          )}
          {post.image && (
            <img
              alt=""
              src={post.image}
              className="flex-1 rounded-3xl w-full h-full pt-2"
              style={{ maxWidth: 600 }}
            />
          )}
          <div className="text-sm pt-2 text-gray">
            {"Replying to "}
            <Link href={`/${encodeURIComponent(username)}`} className="text-sky-500">
              {username}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PostInput(props: Props) {
  const cancelButtonRef = useRef(null);

  if (props.parent) {
    return (
      <Transition.Root show as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => props.setParent(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white bg-opacity-10 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <PostInputMain {...props} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return <PostInputMain {...props} />;
}

/* eslint-disable @next/next/no-img-element */
function PostInputMain({ parent, setParent, hidden = false }: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (!hidden || parent) && contentRef.current?.focus();
  }, [contentRef, hidden, parent]);

  if (hidden && !parent) return null;

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
      parent: parent ? parent.id : undefined,
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

  const remainingChars = MAX_LENGTH - content.length;

  const canSubmit =
    (remainingChars > 0 && content.length > 0 && content.trim() !== "") || selectedFile;

  return (
    <div className="p-3 border-b border-zinc-700">
      {parent && <ParentPost post={parent} />}
      <div className="flex space-x-3">
        <Profile />
        <form onSubmit={handleTweetSubmit} className="flex-1 flex flex-col">
          {parent && <input type="hidden" name="parent" value={parent.id} />}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            ref={contentRef}
            className="bg-transparent focus:outline-none border-gray focus: flex-1 py-4"
            placeholder={parent ? "Tell them how they're wrong" : "What's Happening?"}
            style={{ resize: "none" }}
          />
          <div className="flex items-center mt-4">
            <div className="flex-grow">
              <input type="file" className="hidden" ref={inputRef} onChange={addImage} />
              <button
                onClick={() => {
                  inputRef.current?.click();
                }}
                title="Add Image"
                type="button"
                className="hover:bg-gray-200 hover:bg-opacity-10 text-sky-600 rounded-full"
              >
                <PhotoIcon className="w-7 h-7" />
              </button>
            </div>
            <div
              className={`shrink p-1 px-2 mx-4 rounded-full ${
                remainingChars <= 10
                  ? "text-red-500 border-2 border-red-500 font-bold"
                  : remainingChars <= 50
                  ? "text-yellow-500 border-2 border-yellow-500"
                  : ""
              }`}
            >
              {remainingChars <= 50 ? remainingChars : ""}
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="py-2 px-4 font-bold bg-gradient-to-r rounded-full text-xs bg-sky-600 hover:bg-sky-500 mx-auto disabled:cursor-not-allowed disabled:bg-gray"
            >
              {btnloading ? "..." : parent ? "Reply" : "Post"}
            </button>
          </div>
        </form>
      </div>
      {selectedFile && (
        <div className="p-2 mt-4 relative">
          <p className="absolute text-4xl top-1/2 left-1/2 -translate-x-1/2">PREVIEW</p>
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
