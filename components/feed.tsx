import { Post as PostType } from "@prisma/client";
import React from "react";
import SuperJSON from "superjson";
import { SuperJSONResult } from "superjson/dist/types";
import Post from "./post";

// eslint-disable-next-line react/display-name
export const Feed = React.memo<{ posts: SuperJSONResult; likes: number[] }>(
  ({ posts: rawPosts, likes }) => {
    const posts = SuperJSON.deserialize<PostType[]>(rawPosts);

    return (
      <div className="min-w-fit">
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
              createdAt={p.createdAt}
              isLiked={likes.indexOf(p.id) !== -1}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default Feed;
