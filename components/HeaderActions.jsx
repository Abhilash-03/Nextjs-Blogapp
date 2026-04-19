"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./animate-ui/components/radix/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./animate-ui/components/radix/dropdown-menu";

export function HeaderActions() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      {/* <Link href={'/dashboard/profile'}> */}
      {!session?.user && (
         <Link href={'/auth/signin'}>
                            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-base font-semibold transition hover:border-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer">
                              Sign in
                            </button>
                            </Link>
      )}
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img
              src={
                session?.user?.image ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }
              alt="profile"
              className="h-9 w-9 rounded-full border border-border cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href={'/dashboard/profile'}>
              <DropdownMenuItem>
                <span>Profile</span>
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-red-500 hover:text-white" onClick={() => signOut({callbackUrl: '/'})}>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
