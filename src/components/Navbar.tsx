"use client";

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
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Navbar() {
  return (
    <header className="w-full px-4 py-3 sm:px-6 flex justify-between items-center border-b bg-background">
      <Link href="/">
        <h1 className="text-xl sm:text-2xl font-bold text-primary cursor-pointer">
          Taskify
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-4">
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="ghost" size="sm">Tasks</Button>
          </Link>
          <Link href="/bugs">
            <Button variant="ghost" size="sm">Bugs</Button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 mt-2 p-2 space-y-2">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Link href="/tasks">
                <Button variant="ghost" className="w-full justify-start">Tasks</Button>
              </Link>
              <Link href="/bugs">
                <Button variant="ghost" className="w-full justify-start">Bugs</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-start">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full justify-start">Sign Up</Button>
              </SignUpButton>
            </SignedOut>

            <div className="pt-1 border-t">
              <ModeToggle />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
