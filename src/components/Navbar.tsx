"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Bot, LogOut, LayoutDashboard, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// --- IMPORT SheetTitle & SheetDescription ---
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase";
import React from "react";

interface NavbarProps {
  sidebarContent?: React.ReactNode;
}

export default function Navbar({ sidebarContent }: NavbarProps) {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            
            {sidebarContent && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-zinc-950 border-zinc-800 p-0 text-white w-72">
                    
                    {/* --- ACCESSIBILITY FIX START --- */}
                    {/* These are required but we hide them visually */}
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main navigation and chat history
                    </SheetDescription>
                    {/* --- ACCESSIBILITY FIX END --- */}

                    {sidebarContent}
                  </SheetContent>
                </Sheet>
              </div>
            )}

            <Link href="/" className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                LexiBot
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/chat" className="hidden sm:block">
                      <Button variant="ghost" className="text-zinc-300 hover:text-white">
                        Chat
                      </Button>
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {user.email?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                        <DropdownMenuItem className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-400 focus:text-red-400"
                          onClick={() => auth.signOut()}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login">
                      <Button variant="ghost" className="text-zinc-400 hover:text-white">
                        Login
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="bg-white text-black hover:bg-zinc-200">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}