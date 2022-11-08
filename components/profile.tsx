/* eslint-disable @next/next/no-img-element */

import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div>
      <img
        src={`/api/users/${session.user.id}/avatar`}
        className="w-14 h-14 rounded-full"
        width={32}
        height={32}
        alt="Profile Pic"
      />
    </div>
  );
}
