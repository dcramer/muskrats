export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/:username*",
    "/explore",
    "/bookmarks",
    "/notifications",
    "/messages",
  ],
};
