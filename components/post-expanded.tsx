"use client";

import { Post as PostType } from "@prisma/client";
import { useState } from "react";

import Post from "./post";
import PostInput from "./post-input";

export default function PostExpanded({
  post,
  likes,
}: {
  post: any;
  likes: number[];
}) {
  const parent = post.parent;
  const [replyParent, setParent] = useState<PostType | null>(null);

  return (
    <div className="min-w-fit">
      <PostInput parent={replyParent} setParent={setParent} hidden />

      {!!parent && (
        <Post
          key={parent.id}
          postId={parent.id}
          name="Elon Musk"
          username={`elonmusk#${parent.authorId}`}
          userId={parent.authorId}
          content={parent.content}
          image={parent.image}
          numLikes={parent.numLikes}
          numReplies={parent.numReplies}
          numReposts={parent.numReposts}
          createdAt={parent.createdAt}
          isLiked={likes.indexOf(parent.id) !== -1}
          onReplyTo={() => setParent(parent)}
        />
      )}

      <Post
        key={post.id}
        postId={post.id}
        name="Elon Musk"
        username={`elonmusk#${post.authorId}`}
        userId={post.authorId}
        content={post.content}
        image={post.image}
        numLikes={post.numLikes}
        numReplies={post.numReplies}
        numReposts={post.numReposts}
        createdAt={post.createdAt}
        isLiked={likes.indexOf(post.id) !== -1}
        onReplyTo={() => setParent(post)}
      />
    </div>
  );
}
