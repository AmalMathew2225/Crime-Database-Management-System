"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Upload, CheckCircle, XCircle } from "lucide-react";

interface EvidenceUploaderProps {
  firId: string;
  onUpload?: () => void;
}

const EVIDENCE_TYPES = ["Image", "Video", "Document", "Audio", "Other"];

export function EvidenceUploader({ firId, onUpload }: EvidenceUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("Image");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload() {
    if (!file) return;
    setUploading(true);
    setStatus("idle");

    try {
      // Read file as base64 data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const badge = typeof window !== "undefined" ? localStorage.getItem("officer_badge") || "" : "";
      const res = await fetch(`/api/firs/${firId}/evidence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-officer-badge": badge,
        },
        body: JSON.stringify({
          filename: file.name,
          type,
          description: desc || null,
          dataUrl,
          mimeType: file.type,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFile(null);
        setDesc("");
        if (fileRef.current) fileRef.current.value = "";
        onUpload?.();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full text-sm rounded border border-slate-300 px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Input
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={upload}
            disabled={!file || uploading}
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          {status === "success" && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="h-4 w-4" /> Uploaded successfully
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <XCircle className="h-4 w-4" /> Upload failed
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
