"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserStore } from "@/app/commons/UserStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/app/server actions/cookies-actions";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const params = useSearchParams();
  const fallbackUrl = params.get("fallbackUrl") || "/posts";
  const router = useRouter();
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const user = UserStore.findByEmail(email);

    if (!user || user.password !== password) {
      setError("Invalid email or password");
      return;
    }

    const payload = { name: user.name, email: user.email };
    // Save as cookie string
    try {
      const cookieValue = JSON.stringify(payload);
      // set cookie for 7 days
      await setCookie("currentUser", cookieValue, { maxAge: 7 * 24 * 60 * 60 });

      setSuccess("Logged in successfully");
      setEmail("");
      setPassword("");
      
      //  Push to the fallbackUrl or the posts page
      router.push(fallbackUrl);
    } catch (_) {
      setError("Failed to set login cookie");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
            {success && (
              <div className="mt-4 text-sm text-green-600">{success}</div>
            )}

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={"/users/signup"}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
