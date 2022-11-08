export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/explore", "/bookmarks", "/notifications", "/messages"],
};
