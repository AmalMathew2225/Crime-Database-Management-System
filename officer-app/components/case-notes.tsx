"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Trash2, Edit2 } from "lucide-react";
import type { CaseNote, Officer } from "@/lib/types";

interface CaseNotesProps {
  firId: string;
}

function getBadge() {
  return typeof window !== "undefined" ? localStorage.getItem("officer_badge") || "" : "";
}

export function CaseNotes({ firId }: CaseNotesProps) {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await fetch(`/api/firs/${firId}/notes`);
    if (res.ok) {
      const json = await res.json();
      setNotes(json.notes || []);
    }
  }

  async function submit() {
    if (!text.trim()) return;
    if (editingId) {
      await fetch(`/api/firs/${firId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-officer-badge': getBadge() },
        body: JSON.stringify({ id: editingId, note: text }),
      });
      setEditingId(null);
    } else {
      await fetch(`/api/firs/${firId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-officer-badge': getBadge() },
        body: JSON.stringify({ note: text }),
      });
    }
    setText("");
    fetchNotes();
  }

  async function startEdit(note: CaseNote) {
    setEditingId(note.id);
    setText(note.note);
  }

  async function remove(id: string) {
    await fetch(`/api/firs/${firId}/notes`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-officer-badge': getBadge() },
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle>Investigation Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a note..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={submit}>
              {editingId ? "Save" : "Add"}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.id} className="relative rounded border p-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{n.note}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString()} by {n.officers?.name}
              </p>
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => startEdit(n)} className="text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => remove(n.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
