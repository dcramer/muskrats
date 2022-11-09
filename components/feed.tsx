"use client";

import { Post as PostType } from "@prisma/client";
import React, { useState } from "react";
import SuperJSON from "superjson";
import { SuperJSONResult } from "superjson/dist/types";
import Post from "./post";
import PostInput from "./post-input";

type Props = {
  posts: SuperJSONResult;
  pendingUpdates?: SuperJSONResult;
  likes?: number[];
  showNewPost?: boolean;
  onShowPending?: () => void;
};

type PostResult = PostType & {
  isLiked?: boolean;
};

// eslint-disable-next-line react/display-name
export const Feed = ({
  posts: rawPosts,
  pendingUpdates: rawPendingUpdates,
  likes = [],
  showNewPost = false,
  onShowPending = () => {},
}: Props) => {
  const posts = SuperJSON.deserialize<PostResult[]>(rawPosts);
  const pendingUpdates = rawPendingUpdates
    ? SuperJSON.deserialize<PostResult[]>(rawPendingUpdates)
    : [];
  const [parent, setParent] = useState<PostResult | null>(null);

  return (
    <div className="min-w-fit">
      <PostInput parent={parent} setParent={setParent} hidden={!showNewPost} />

      {pendingUpdates.length > 0 && (
        <div
          className="py-4 px-4 cursor-pointer text-center border-b border-zinc-700 hover:bg-gray hover:bg-opacity-10 text-sky-500"
          onClick={onShowPending}
        >
          Show {pendingUpdates.length} Post{pendingUpdates.length !== 1 && "s"}
        </div>
      )}

      <div>
        {posts.map((p) => (
          <Post
            key={p.id}
            postId={p.id}
            name="Elon Musk"
            username={`elonmusk#${p.authorId}`}
            userId={p.authorId}
            content={p.content}
            image={p.image}
            numLikes={p.numLikes}
            numReplies={p.numReplies}
            numReposts={p.numReposts}
            createdAt={p.createdAt}
            isLiked={p.isLiked || likes.indexOf(p.id) !== -1}
            onReplyTo={() => setParent(p)}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
