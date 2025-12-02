"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

export default function SpinInstructionsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the instructions before
    const hasSeenInstructions = localStorage.getItem("spin_instructions_seen");
    
    if (!hasSeenInstructions) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    // Mark as seen in localStorage
    localStorage.setItem("spin_instructions_seen", "true");
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-2xl">🎡 How to Play</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Spin the Wheel</h3>
              <p className="text-gray-600">
                Click the <span className="font-semibold">"SPIN TO WIN!"</span> button to spin the prize wheel. 
                You get one spin per calendar, so make it count!
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Win Amazing Prizes</h3>
              <p className="text-gray-600">
                Each segment represents a different prize. The smaller the segment, 
                the rarer the prize! Look out for the tiny slices - they're the most valuable!
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <h3 className="font-bold text-lg mb-2 text-pink-700">📬 Redeem Your Prize</h3>
              <p className="text-gray-700 mb-3">
                To claim your prize, contact us with your winning details:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">•</span>
                  <span><strong>X/Twitter:</strong> DM <a href="https://x.com/tsi_org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@tsi_org</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">•</span>
                  <span><strong>Email:</strong> <a href="mailto:rcohen@mytsi.org" className="text-blue-600 hover:underline">rcohen@mytsi.org</a></span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 italic">
              Good luck! 🍀
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleClose} size="lg" className="w-full">
            Got it, let's spin!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
