"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CustomCoverUploaderProps = {
  bookId: string;
};

export function CustomCoverUploader({ bookId }: CustomCoverUploaderProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUpload() {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("bookId", bookId);
        formData.append("file", file);

        const response = await fetch("/api/library/cover", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Errore nel caricamento.");
        }
      }

      setFiles([]);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore imprevisto.";
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        className="cursor-pointer hover:bg-red"
      />
      <Button
        type="button"
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
        className="w-full"
      >
        {isUploading ? "Caricamento..." : "Carica cover personalizzate"}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
