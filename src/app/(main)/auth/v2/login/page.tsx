"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

import { SignIn, useUser } from "@clerk/nextjs";

import { APP_CONFIG } from "@/config/app-config";

export default function LoginV2() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return redirect("/dashboard/default");
  }
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
        </div>
        <div className="space-y-4">
          <SignIn routing="hash" />
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-end px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
      </div>
    </>
  );
}
