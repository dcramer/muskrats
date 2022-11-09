"use client";

import SuperJSON from "superjson";
import { useEffect, useState } from "react";

import Feed from "../../components/feed";

import { useInterval } from "usehooks-ts";
import { Post } from "@prisma/client";

type PostResult = Post & {
  isLiked?: boolean;
};

const dedupe = (plist: any[]) => {
  const seen = new Set();
  const result: any[] = [];
  plist.forEach((p) => {
    if (seen.has(p.id)) return;
    result.push(p);
    seen.add(p.id);
  });
  return result;
};

export default function RealtimeFeed({
  userId,
  showNewPost = false,
}: {
  userId?: number;
  showNewPost: boolean;
}) {
  const [postList, setPostList] = useState<PostResult[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<PostResult[]>([]);

  useEffect(() => {
    const updateFeed = async () => {
      const posts = SuperJSON.deserialize<PostResult[]>(
        await (await fetch("/api/posts")).json()
      );
      setPostList(posts);
    };

    updateFeed();
  }, [userId]);

  useInterval(async () => {
    const posts = SuperJSON.deserialize<PostResult[]>(
      await (await fetch("/api/posts")).json()
    );

    const tmpPendingUpdates = [...pendingUpdates];
    let post: PostResult;
    for (let i = 0; i < posts.length; i++) {
      post = posts[i];
      if (
        post.id === postList[0].id ||
        (pendingUpdates.length && post.id === pendingUpdates[0].id)
      ) {
        break;
      }
      tmpPendingUpdates.push(post);
    }

    setPendingUpdates(dedupe(tmpPendingUpdates));
  }, 5000);

  const onShowPending = () => {
    setPendingUpdates([]);
    setPostList(dedupe([...pendingUpdates, ...postList]));
  };

  return (
    <>
      <Feed
        posts={SuperJSON.serialize(postList)}
        showNewPost={showNewPost}
        pendingUpdates={SuperJSON.serialize(pendingUpdates)}
        onShowPending={onShowPending}
      />
    </>
  );
}
