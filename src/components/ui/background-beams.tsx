"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-50 overflow-hidden",
        className
      )}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 blur-[100px]" />
    </div>
  );
};