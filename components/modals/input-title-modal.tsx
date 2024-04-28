"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ProfileUpdateModal = ({
  handleModalSubmit,
  profile,
  shouldModalOpen,
}: any) => {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update the handleSubmit function to call handleModalSubmit with company and title
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleModalSubmit(title, department);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
      //   reload window
      window.location.reload();
    }
  };

  if (!shouldModalOpen) {
    return null;
  }

  if (!profile.title) {
    return (
      <Dialog open={true}>
        <DialogContent className="text-black dark:text-white p-0 overflow-hidden bg-white dark:bg-black">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Whats your title?
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="mb-4">
              <Label className="block text-sm font-medium text-neutral-700 dark:text-neutral-400">
                Title
              </Label>
              <Input
                type="text"
                placeholder="Software Engineer"
                className="mt-1 block w-full bg-neutral-200 dark:bg-neutral-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Label className="block mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-400">
                Department
              </Label>
              <Input
                type="text"
                placeholder="Engineering"
                className="mt-1 block w-full bg-neutral-200 dark:bg-neutral-700"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full justify-center"
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};
