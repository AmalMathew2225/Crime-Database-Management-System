"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Download, Trash2, FileText, Image as ImageIcon, Film, Music, File } from "lucide-react";
import { Button } from "./ui/button";

interface EvidenceItem {
  id: string;
  filename: string;
  type: string;
  description?: string | null;
  dataUrl: string;
  mimeType?: string;
  created_at: string;
  officers?: { name: string };
}

interface EvidenceListProps {
  firId: string;
}

function typeIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "image": return <ImageIcon className="h-4 w-4 text-blue-500" />;
    case "video": return <Film className="h-4 w-4 text-purple-500" />;
    case "audio": return <Music className="h-4 w-4 text-green-500" />;
    case "document": return <FileText className="h-4 w-4 text-orange-500" />;
    default: return <File className="h-4 w-4 text-gray-500" />;
  }
}

export function EvidenceList({ firId }: EvidenceListProps) {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidence();
  }, []);

  async function fetchEvidence() {
    setLoading(true);
    const res = await fetch(`/api/firs/${firId}/evidence`);
    if (res.ok) {
      const json = await res.json();
      setItems(json.evidence || []);
    }
    setLoading(false);
  }

  async function remove(id: string) {
    await fetch(`/api/firs/${firId}/evidence`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle>Evidence Files</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading && <p className="text-sm text-muted-foreground text-center py-2">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">No evidence uploaded yet.</p>
        )}
        <ul className="space-y-2">
          {items.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded border p-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 flex-shrink-0">{typeIcon(e.type)}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{e.filename}</p>
                  {e.description && <p className="text-xs text-muted-foreground">{e.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString("en-IN")}{e.officers?.name ? ` · ${e.officers.name}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={e.dataUrl}
                  download={e.filename}
                  className="flex items-center gap-1 text-xs text-primary hover:underline px-2 py-1 rounded border"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80 h-7 w-7 p-0"
                  onClick={() => remove(e.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
