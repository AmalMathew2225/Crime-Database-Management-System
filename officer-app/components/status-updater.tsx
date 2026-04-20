"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const STATUSES = [
    "Registered",
    "Under Investigation",
    "Charge Sheet Filed",
    "Court Proceedings",
    "Closed",
];

const statusColors: Record<string, string> = {
    Registered: "bg-blue-100 text-blue-800 border-blue-200",
    "Under Investigation": "bg-amber-100 text-amber-800 border-amber-200",
    "Charge Sheet Filed": "bg-green-100 text-green-800 border-green-200",
    "Court Proceedings": "bg-purple-100 text-purple-800 border-purple-200",
    Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusUpdater({ firId, initialStatus }: { firId: string; initialStatus: string }) {
    const [status, setStatus] = useState(initialStatus);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleChange(newStatus: string) {
        setSaving(true);
        setSaved(false);
        setStatus(newStatus);
        const badge = typeof window !== "undefined" ? localStorage.getItem("officer_badge") || "" : "";
        await fetch(`/api/firs/${firId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "x-officer-badge": badge },
            body: JSON.stringify({ status: newStatus }),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusColors[status]} text-sm px-3 py-1 font-semibold rounded-full`}>
                {status}
            </Badge>
            <div className="flex items-center gap-2">
                <select
                    value={status}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={saving}
                    className="text-xs rounded border border-slate-300 px-2 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
                {saved && <span className="text-xs text-green-600 font-medium">✓ Saved</span>}
            </div>
        </div>
    );
}
