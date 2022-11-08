"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ChatBubbleOvalLeftIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";

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

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const Content = React.memo(function Content({ value }: { value: string }) {
  const regex = /(?:^|[^@\w])@(\w{1,15}#[\d]+)\b/g;
  const html = escapeHtml(value).replace(regex, (...args) => {
    return `<a href="${encodeURIComponent(
      args[1]
    )}" class="text-sky-500 no-underline hover:underline">@${args[1]}</a>`;
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
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

  isLiked,
}: {
  postId: number;
  name: string;
  username: string;
  userId: number;
  image?: string | null;
  content?: string | null;
  createdAt: Date;
  numLikes: number;

  isLiked: boolean;
}) {
  const [isLikedCurrent, setLiked] = useState(isLiked);
  const [likeCountCurrent, setLikeCount] = useState(numLikes);

  return (
    <div className="pt-4 py-2 px-4 cursor-pointer border-b border-zinc-700 hover:bg-gray-600 hover:bg-opacity-30">
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
            <p className="font-semibold hover:underline flex">
              <Link href={`/${encodeURIComponent(username)}`} className="flex">
                {name} <CheckBadgeIcon className={`text-white-600 w-5 h-5`} />
              </Link>
            </p>
            <p className="text-base font-light">@{username}</p>
            <span className="font-bold">&middot;</span>

            <p className="text-base text-gray hover:underline">
              <Link href={`/${encodeURIComponent(username)}/status/${postId}`}>
                {moment(createdAt).fromNow()}
              </Link>
            </p>
          </div>
          {content && (
            <p className="text-base text-justify whitespace-pre-line">
              <Content value={content} />
            </p>
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
            <PostFooterInfo
              Icon={ChatBubbleOvalLeftIcon}
              color="gray"
              count={0}
            />
            <PostFooterInfo Icon={ArrowsRightLeftIcon} color="gray" count={0} />
            <PostFooterInfo
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

const PostFooterInfo = ({ Icon, count, color, ...props }: any) => {
  const theme = `text-${color}`;
  return (
    <div
      className={`${theme} text-sm flex items-center space-x-2 bg-transparent hover:bg-slate-100 rounded-3xl hover:bg-opacity-10 p-2 hover:text-sky-400`}
      {...props}
    >
      <Icon className={`w-5 h-5`} />
      <p className={theme}>{count}</p>
    </div>
  );
};
