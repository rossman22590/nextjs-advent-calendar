"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { authAction } from "../login/server-actions";
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      const result = await authAction("register", formData);
      
      // If result is returned (not redirected), show error
      if (result && !result.success) {
        setErrorMessage(result.error || "Registration failed");
        setIsOpen(true);
      }
    } catch (error: any) {
      // Ignore Next.js redirect errors
      if (error?.message?.includes("NEXT_REDIRECT")) {
        return;
      }
      setErrorMessage(error.message || "Registration failed");
      setIsOpen(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg w-full">
        <div className="flex flex-col gap-5 bg-[#0a0015] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] p-10 border border-purple-500/30">
          <div className="text-2xl font-semibold text-white">Register</div>
          <form
            className="flex flex-col gap-4"
            action={handleSubmit}
          >
            <Input 
              name="inviteCode" 
              type="text" 
              label="Invite Code" 
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
            <Button type="submit" color="primary" size="lg">
              Create account
            </Button>
          </form>
          <p className="text-base mt-4 text-gray-300">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300">
              Login
            </Link>
          </p>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Registration Issue</ModalHeader>
          <ModalBody>
            <p>{errorMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsOpen(false)}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
