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
      await authAction("register", formData);
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
        <Card>
          <CardHeader className="text-2xl font-semibold">Register</CardHeader>
          <CardBody>
          <form
            className="flex flex-col gap-4"
            action={handleSubmit}
          >
            <Input name="email" type="email" label="Email" required size="lg" />
            <Input name="password" type="password" label="Password" required size="lg" />
            <Button type="submit" color="primary" size="lg">
              Create account
            </Button>
          </form>
          <p className="text-base mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </p>
          </CardBody>
        </Card>
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
