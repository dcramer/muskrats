"use client";

import { Post as PostType } from "@prisma/client";
import React, { useState } from "react";
import Post from "./post";
import PostInput from "./post-input";

type Props = {
  posts: PostType[];
  likes: number[];
  showNewPost?: boolean;
};

// eslint-disable-next-line react/display-name
export const Feed = ({ posts, likes, showNewPost = false }: Props) => {
  const [parent, setParent] = useState<PostType | null>(null);

  return (
    <div className="min-w-fit">
      <PostInput parent={parent} setParent={setParent} hidden={!showNewPost} />

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
            isLiked={likes.indexOf(p.id) !== -1}
            onReplyTo={() => setParent(p)}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
