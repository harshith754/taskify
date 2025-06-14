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
import { 
  Menu, 
  LayoutDashboard, 
  CheckSquare, 
  Bug, 
  LogIn, 
  UserPlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
            <Button variant="ghost" size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </Button>
          </Link>
          <Link href="/bugs">
            <Button variant="ghost" size="sm" className="gap-2">
              <Bug className="h-4 w-4" />
              Bugs
            </Button>
          </Link>
        </SignedIn>
        
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <ModeToggle />
      </div>
      
      {/* Mobile Menu */}
      <div className="sm:hidden flex items-center gap-2">
        <ModeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 mt-2 p-2 space-y-2">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/tasks">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Tasks
                </Button>
              </Link>
              <Link href="/bugs">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Bug className="h-4 w-4" />
                  Bugs
                </Button>
              </Link>
              <div className="flex flex-row pl-3 gap-3 justify-start items-center pt-2 border-t">
                <UserButton afterSignOutUrl="/" />
                <div className="text-sm flex items-center gap-1">
                  Profile
                </div>
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}