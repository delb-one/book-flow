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
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUpload() {
    if (!file || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
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

      setFile(null);
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
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? "Caricamento..." : "Carica cover personalizzata"}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
