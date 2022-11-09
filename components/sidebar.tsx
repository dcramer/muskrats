import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getActiveSection(path: string) {
  if (path === "/") {
    return "home";
  }
  const section = path.split("/")[1];
  // todo: check for profile
  return section;
}

export default function Sidebar() {
  // const username = `elonmusk#${session.user.id}`;
  const username = "elonmusk#1";
  return (
    <div className=" lg:pr-2 fixed">
      <div className="flex flex-col items-center md:items-start md:ml-4 space-y-3">
        <Link href="/">
          <div className="hover-animation w-16 h-16 flex items-center justify-center">
            <Image src="/favicon.png" width="32" height="32" alt="logo" />
          </div>
        </Link>
        <SidebarHelper Icon={HomeIcon} title={"Home"} href="/" />
        <SidebarHelper Icon={HashtagIcon} title={"Explore"} href="/explore" />
        <SidebarHelper
          Icon={BellIcon}
          title={"Notifications"}
          href="/notifications"
        />
        <SidebarHelper
          Icon={EnvelopeIcon}
          title={"Messages"}
          href="/messages"
        />
        <SidebarHelper
          Icon={BookmarkIcon}
          title={"Bookmarks"}
          href="/bookmarks"
        />
        <SidebarHelper
          Icon={UserIcon}
          title={"Profile"}
          href={`/${encodeURIComponent(username)}`}
        />
        {/* {canPost && (
          <button
            onClick={() => {
              contentRef.current.focus();
            }}
            className="py-3 px-4 font-bold bg-gradient-to-r  lg:w-full  rounded-full text-lg bg-sky-600 hover:bg-sky-500 mx-auto"
          >
            <PlusIcon className="lg:hidden w-5 h-5" />
            <span className="hidden lg:block tracking-wide">Tweet</span>
          </button>
        )} */}
      </div>
    </div>
  );
}

const SidebarHelper = ({ Icon, title, href }: any) => {
  const pathname = usePathname();
  const section = getActiveSection(pathname || "");
  const active = title.toLowerCase() === section;
  return (
    <Link href={href}>
      <div
        className={` flex items-center  w-max hover-animation ${
          active ? "bg-slate-300 bg-opacity-10 font-bold" : "font-extralight"
        }`}
      >
        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
        <h1 className="ml-4 text-xl hidden lg:inline-flex">{title}</h1>
      </div>
    </Link>
  );
};
