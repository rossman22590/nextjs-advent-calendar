"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { authAction } from "./server-actions";
import { useState } from "react";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check for OAuth error on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not_registered") {
      setErrorMessage("You don't have an account yet. Please register with an invite code first.");
      setIsOpen(true);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    try {
      const result = await authAction("login", formData);
      
      // If result is returned (not redirected), show error
      if (result && !result.success) {
        setErrorMessage(result.error || "Login failed");
        setIsOpen(true);
      }
    } catch (error: any) {
      // Ignore Next.js redirect errors
      if (error?.message?.includes("NEXT_REDIRECT")) {
        return;
      }
      setErrorMessage(error.message || "Login failed");
      setIsOpen(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg w-full">
        <div className="flex flex-col gap-5 bg-[#0a0015] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] p-10 border border-purple-500/30">
          <div className="text-3xl font-semibold text-white">Welcome back</div>
          <div className="text-sm text-gray-300 mb-2">Sign in to your calendar</div>
          <form
            className="flex flex-col gap-4 p-0"
            action={handleSubmit}
          >
            <Input
              name="email"
              type="email"
              label="Email"
              required
              size="lg"
              variant="bordered"
              classNames={{
                input: "text-white placeholder:text-gray-400",
                label: "!text-pink-300 group-data-[filled=true]:!text-pink-300",
                inputWrapper: "bg-white/10 border-2 border-white/30 hover:border-white/50 focus-within:border-pink-400 data-[hover=true]:bg-white/10"
              }}
              style={{ color: 'white' } as any}
              labelPlacement="inside"
            />
            <Input
              name="password"
              type="password"
              label="Password"
              required
              size="lg"
              variant="bordered"
              classNames={{
                input: "text-white placeholder:text-gray-400",
                label: "!text-pink-300 group-data-[filled=true]:!text-pink-300",
                inputWrapper: "bg-white/10 border-2 border-white/30 hover:border-white/50 focus-within:border-pink-400 data-[hover=true]:bg-white/10"
              }}
              style={{ color: 'white' } as any}
              labelPlacement="inside"
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0a0015] text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            size="lg"
            variant="bordered"
            className="border-white/30 hover:border-white/50 text-white"
            onPress={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-base mt-4 text-gray-300 text-center">
            Need an account?{" "}
            <Link href="/register" className="text-pink-400 hover:text-pink-300">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {errorMessage?.includes("don't have an account") ? "Account Not Found" : "Login Issue"}
          </ModalHeader>
          <ModalBody>
            <p>{errorMessage}</p>
          </ModalBody>
          <ModalFooter>
            {errorMessage?.includes("don't have an account") ? (
              <>
                <Button color="default" variant="light" onPress={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button color="primary" as={Link} href="/register">
                  Go to Register
                </Button>
              </>
            ) : (
              <Button color="primary" onPress={() => setIsOpen(false)}>
                Got it
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
