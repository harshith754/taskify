
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import type { FC, JSX } from "react";

export default function Navbar(): JSX.Element {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b bg-background">
      <h1 className="text-2xl font-bold text-primary">Taskify</h1>

      <div className="flex items-center gap-4">
        {/* Navigation links when signed in */}
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="ghost">Tasks</Button>
          </Link>
          <Link href="/bugs">
            <Button variant="ghost">Bugs</Button>
          </Link>
        </SignedIn>

        {/* Auth buttons when signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal" >
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        {/* User menu when signed in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        {/* Theme toggle button */}
        <ModeToggle />
      </div>
    </header>
  );
}
