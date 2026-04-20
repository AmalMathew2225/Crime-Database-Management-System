"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

const CRIME_TYPES = [
  { id: "ct-1", name: "Theft (IPC 378)" },
  { id: "ct-2", name: "Assault (IPC 351)" },
  { id: "ct-3", name: "Cheating / Fraud (IPC 420)" },
  { id: "ct-4", name: "Cyber Crime (66D IT Act)" },
  { id: "ct-5", name: "Robbery (IPC 390)" },
  { id: "ct-6", name: "Trespassing (IPC 447)" },
  { id: "ct-7", name: "Domestic Violence (IPC 498A)" },
];

interface Props {
  onSuccess?: (fir: any) => void;
}

type Accused = { name?: string; address?: string; description?: string };
type PropertyItem = { item_name?: string; quantity?: number; estimated_value?: number };

// Returns null instead of "" for optional string fields
function optionalStr(fd: FormData, key: string): string | null {
  const val = String(fd.get(key) || "").trim();
  return val === "" ? null : val;
}

export function FIRForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accused, setAccused] = useState<Accused[]>([]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(name: string, value: any) {
    switch (name) {
      case "complainant_name":
        return !value || String(value).trim() === "" ? "Complainant name is required" : undefined;
      case "description":
        return !value || String(value).trim() === "" ? "Description is required" : undefined;
      case "location":
        return !value || String(value).trim() === "" ? "Location is required" : undefined;
      case "crime_type_id":
        return !value || String(value).trim() === "" ? "Crime type is required" : undefined;
      case "phone":
        if (!value) return undefined;
        return String(value).length < 6 ? "Enter a valid phone number" : undefined;
      default:
        return undefined;
    }
  }

  function addAccused() { setAccused((s) => [...s, {}]); }
  function removeAccused(i: number) { setAccused((s) => s.filter((_, idx) => idx !== i)); }
  function updateAccused(i: number, patch: Partial<Accused>) {
    setAccused((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function addProperty() { setProperties((s) => [...s, { quantity: 1 }]); }
  function removeProperty(i: number) { setProperties((s) => s.filter((_, idx) => idx !== i)); }
  function updateProperty(i: number, patch: Partial<PropertyItem>) {
    setProperties((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const payload: any = {
      // Required fields — keep as strings
      complainant_name: String(fd.get("complainant_name") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      crime_type_id: String(fd.get("crime_type_id") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      // Optional fields — coerce empty strings to null for clean API data
      guardian_name: optionalStr(fd, "guardian_name"),
      gender: optionalStr(fd, "gender"),
      age: fd.get("age") ? Number(fd.get("age")) : null,
      dob: optionalStr(fd, "dob"),
      address: optionalStr(fd, "address"),
      phone: optionalStr(fd, "phone"),
      date_of_occurrence: optionalStr(fd, "date_of_occurrence"),
      time_of_occurrence: optionalStr(fd, "time_of_occurrence"),
      ipc_sections: optionalStr(fd, "ipc_sections"),
      accused: accused.filter((a) => a.name || a.address || a.description),
      property_items: properties.filter((p) => p.item_name),
    };

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!payload.complainant_name) newErrors.complainant_name = "Complainant name is required";
    if (!payload.description) newErrors.description = "Description is required";
    if (!payload.location) newErrors.location = "Location is required";
    if (!payload.crime_type_id) newErrors.crime_type_id = "Crime type is required";
    if (payload.phone && String(payload.phone).length < 6) newErrors.phone = "Enter a valid phone number";

    setErrors(newErrors);
    setTouched({ complainant_name: true, description: true, location: true, crime_type_id: true, phone: true });
    if (Object.keys(newErrors).length > 0) return setError("Please fix the highlighted fields");

    setLoading(true);
    try {
      const badge = typeof window !== "undefined" ? localStorage.getItem("officer_badge") || "" : "";
      const res = await fetch("/api/firs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-officer-badge": badge,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 400 && json?.fieldErrors) {
          const fe: Record<string, string[]> = json.fieldErrors;
          const mapped: Record<string, string> = {};
          Object.entries(fe).forEach(([k, v]) => {
            if (Array.isArray(v) && v.length > 0) mapped[k] = v.join(" ");
            else if (typeof v === "string") mapped[k] = v;
          });
          setErrors((prev) => ({ ...prev, ...mapped }));
          const touchedMap: Record<string, boolean> = {};
          Object.keys(mapped).forEach((k) => (touchedMap[k] = true));
          setTouched((t) => ({ ...t, ...touchedMap }));
          setError("Please fix the highlighted fields");
          return;
        }
        throw new Error(json?.error || "Failed to create FIR");
      }

      setSuccess("FIR registered successfully");
      form.reset();
      setAccused([]);
      setProperties([]);
      setErrors({});
      setTouched({});
      if (onSuccess) onSuccess(json.fir);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium">Complainant Full Name *</label>
        <div className="relative">
          <input
            name="complainant_name"
            required
            aria-invalid={!!errors.complainant_name}
            className={cn("mt-1 block w-full pr-8", errors.complainant_name && "border-red-600 ring-1 ring-red-200")}
            onBlur={() => setTouched((t) => ({ ...t, complainant_name: true }))}
            onChange={(e) => {
              const val = e.target.value;
              setErrors((prev) => {
                const copy = { ...prev };
                const err = validateField("complainant_name", val);
                if (err) copy.complainant_name = err; else delete copy.complainant_name;
                return copy;
              });
            }}
          />
          {errors.complainant_name && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />}
        </div>
        {touched.complainant_name && errors.complainant_name && <p className="text-xs text-red-600 mt-1">{errors.complainant_name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Guardian Name</label>
        <input name="guardian_name" className="mt-1 block w-full" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select name="gender" className="mt-1 block w-full">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Age</label>
          <input name="age" type="number" className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">DOB</label>
          <input name="dob" type="date" className="mt-1 block w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input name="address" className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <div className="relative">
          <input
            name="phone"
            type="tel"
            aria-invalid={!!errors.phone}
            className={cn("mt-1 block w-full pr-8", errors.phone && "border-red-600 ring-1 ring-red-200")}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            onChange={(e) => {
              const val = e.target.value;
              setErrors((prev) => {
                const copy = { ...prev };
                const err = validateField("phone", val);
                if (err) copy.phone = err; else delete copy.phone;
                return copy;
              });
            }}
          />
          {errors.phone && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />}
        </div>
        {touched.phone && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
      </div>

      <hr />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">Date of Occurrence</label>
          <input name="date_of_occurrence" type="date" className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Time of Occurrence</label>
          <input name="time_of_occurrence" type="time" className="mt-1 block w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Location *</label>
        <div className="relative">
          <input
            name="location"
            required
            aria-invalid={!!errors.location}
            className={cn("mt-1 block w-full pr-8", errors.location && "border-red-600 ring-1 ring-red-200")}
            onBlur={() => setTouched((t) => ({ ...t, location: true }))}
            onChange={(e) => {
              const val = e.target.value;
              setErrors((prev) => {
                const copy = { ...prev };
                const err = validateField("location", val);
                if (err) copy.location = err; else delete copy.location;
                return copy;
              });
            }}
          />
          {errors.location && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />}
        </div>
        {touched.location && errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Crime Type *</label>
        <div className="relative">
          <select
            name="crime_type_id"
            required
            aria-invalid={!!errors.crime_type_id}
            defaultValue=""
            className={cn("mt-1 block w-full", errors.crime_type_id && "border-red-600 ring-1 ring-red-200")}
            onBlur={() => setTouched((t) => ({ ...t, crime_type_id: true }))}
            onChange={(e) => {
              const val = e.target.value;
              setErrors((prev) => {
                const copy = { ...prev };
                const err = validateField("crime_type_id", val);
                if (err) copy.crime_type_id = err; else delete copy.crime_type_id;
                return copy;
              });
            }}
          >
            <option value="" disabled>Select crime type...</option>
            {CRIME_TYPES.map((ct) => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>
          {errors.crime_type_id && <AlertTriangle className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />}
        </div>
        {touched.crime_type_id && errors.crime_type_id && <p className="text-xs text-red-600 mt-1">{errors.crime_type_id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">IPC Sections</label>
        <input name="ipc_sections" className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Description / Narrative *</label>
        <div className="relative">
          <textarea
            name="description"
            required
            aria-invalid={!!errors.description}
            className={cn("mt-1 block w-full pr-8", errors.description && "border-red-600 ring-1 ring-red-200")}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            onChange={(e) => {
              const val = e.target.value;
              setErrors((prev) => {
                const copy = { ...prev };
                const err = validateField("description", val);
                if (err) copy.description = err; else delete copy.description;
                return copy;
              });
            }}
          />
          {errors.description && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />}
        </div>
        {touched.description && errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>

      <hr />

      <section>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Accused Details</h4>
          <button type="button" onClick={addAccused} className="text-sm text-accent">+ Add Accused</button>
        </div>
        <div className="space-y-2 mt-2">
          {accused.length === 0 && <p className="text-xs text-muted-foreground">No accused added</p>}
          {accused.map((a, i) => (
            <div key={i} className="p-2 border rounded grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="block text-xs">Name</label>
                <input value={a.name || ""} onChange={(e) => updateAccused(i, { name: e.target.value })} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-xs">Address</label>
                <input value={a.address || ""} onChange={(e) => updateAccused(i, { address: e.target.value })} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-xs">Description</label>
                <div className="flex gap-2">
                  <input value={a.description || ""} onChange={(e) => updateAccused(i, { description: e.target.value })} className="mt-1 block w-full" />
                  <button type="button" onClick={() => removeAccused(i)} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mt-4">
          <h4 className="text-sm font-medium">Property Details</h4>
          <button type="button" onClick={addProperty} className="text-sm text-accent">+ Add Item</button>
        </div>
        <div className="space-y-2 mt-2">
          {properties.length === 0 && <p className="text-xs text-muted-foreground">No property items added</p>}
          {properties.map((p, i) => (
            <div key={i} className="p-2 border rounded grid grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-xs">Item Name</label>
                <input value={p.item_name || ""} onChange={(e) => updateProperty(i, { item_name: e.target.value })} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-xs">Quantity</label>
                <input type="number" value={p.quantity ?? 1} onChange={(e) => updateProperty(i, { quantity: Number(e.target.value) })} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-xs">Estimated Value</label>
                <input type="number" step="0.01" value={p.estimated_value ?? ""} onChange={(e) => updateProperty(i, { estimated_value: e.target.value ? Number(e.target.value) : undefined })} className="mt-1 block w-full" />
              </div>
              <div className="flex items-center">
                <button type="button" onClick={() => removeProperty(i)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
          {loading ? "Submitting..." : "Register FIR"}
        </button>
      </div>
    </form>
  );
}
