"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ProfileSectionProps = {
  user: any;
};

export function ProfileSection({ user }: ProfileSectionProps) {
  const displayName = user?.displayName || user?.name || user?.primaryEmail || user?.email || "User";

  return (
    <div className="flex w-full items-center justify-between border-b bg-muted/30 px-6 py-3">
      <div className="text-sm">
        <span className="text-muted-foreground">Signed in as</span>{" "}
        <span className="font-medium">{displayName}</span>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/handler/sign-out">Log out</Link>
      </Button>
    </div>
  );
}