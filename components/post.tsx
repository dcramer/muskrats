"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import moment from "moment";
import Link from "next/link";
import {
  ChatBubbleOvalLeftIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import PostContent from "./post-content";
import { useRouter } from "next/navigation";

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY",
  },
});

export default function Post({
  postId,
  name,
  username,
  image,
  userId,
  content,
  createdAt,
  numLikes,
  numReplies,
  numReposts,
  isLiked,
  onReplyTo,
}: {
  postId: number;
  name: string;
  username: string;
  userId: number;
  image?: string | null;
  content?: string | null;
  createdAt: Date;
  numLikes: number;
  numReplies: number;
  numReposts: number;
  isLiked: boolean;

  onReplyTo: () => void;
}) {
  const [isLikedCurrent, setLiked] = useState(isLiked);
  const [likeCountCurrent, setLikeCount] = useState(numLikes);
  const router = useRouter();

  const postLink = `/${encodeURIComponent(username)}/status/${postId}`;

  return (
    <div
      className="pt-4 py-2 px-4 cursor-pointer border-b border-zinc-700 hover:bg-gray hover:bg-opacity-10"
      onClick={(e) => {
        e.preventDefault();
        if (e.target.tagName === "A") return;
        const isTextSelected = window && window.getSelection()?.toString();
        if (!isTextSelected) {
          router.push(postLink);
        }
      }}
    >
      <div className="flex items-start justify-stretch space-x-3">
        <img
          src={`/api/users/${userId}/avatar`}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full w-7 h-7 sm:h-10 sm:w-10"
        />
        <div className="flex flex-col space-y-0 text-base flex-1">
          <div className="flex space-x-2 items-center">
            <div className="font-semibold hover:underline flex">
              <Link href={`/${encodeURIComponent(username)}`} className="flex">
                {name} <CheckBadgeIcon className={`text-white-600 w-5 h-5`} />
              </Link>
            </div>
            <div className="text-base font-light">@{username}</div>
            <span className="font-bold">&middot;</span>

            <div className="text-base text-gray hover:underline">
              <Link href={postLink}>{moment(createdAt).fromNow()}</Link>
            </div>
          </div>
          {content && (
            <div className="text-base text-justify whitespace-pre-line">
              <PostContent value={content} />
            </div>
          )}
          {image && (
            <img
              alt=""
              src={image}
              className="flex-1 rounded-3xl w-full h-full pt-2"
              style={{ maxWidth: 600 }}
            />
          )}

          <div className="flex items-center justify-between">
            <PostAction
              Icon={ChatBubbleOvalLeftIcon}
              color="gray"
              count={numReplies}
              onClick={(e: any) => {
                e.preventDefault();
                onReplyTo();
              }}
            />
            <PostAction
              Icon={ArrowsRightLeftIcon}
              color="gray"
              count={numReposts}
            />
            <PostAction
              Icon={isLikedCurrent ? FilledHeartIcon : HeartIcon}
              color={isLikedCurrent ? "red" : "gray"}
              count={likeCountCurrent}
              onClick={async (e: any) => {
                const res = await fetch(`/api/posts/${postId}/likes`, {
                  method: isLikedCurrent ? "DELETE" : "POST",
                });

                if (res.status === 201 && !isLikedCurrent) {
                  setLiked(true);
                  setLikeCount(likeCountCurrent + 1);
                } else if (res.status === 204 && isLikedCurrent) {
                  setLiked(false);
                  setLikeCount(likeCountCurrent - 1);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const PostAction = ({ Icon, count, color, ...props }: any) => {
  const theme = `text-${color}`;
  return (
    <div
      className={`${theme} text-sm flex items-center space-x-2 bg-transparent hover:bg-slate-100 rounded-3xl hover:bg-opacity-10 p-2 hover:text-sky-400`}
      {...props}
    >
      <Icon className={`w-5 h-5`} />
      <div className={theme}>{count}</div>
    </div>
  );
};
