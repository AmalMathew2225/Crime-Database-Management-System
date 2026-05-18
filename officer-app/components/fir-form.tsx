"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, User, MapPin, Users, Box, Plus, Trash2, ShieldAlert } from "lucide-react";

interface Props {
  onSuccess?: (fir: any) => void;
}

type CrimeType = { id: string; name: string; ipc_section?: string | null };
type Accused = { name?: string; address?: string; description?: string };
type PropertyItem = { item_name?: string; quantity?: number; estimated_value?: number };

// Returns null instead of "" for optional string fields
function optionalStr(fd: FormData, key: string): string | null {
  const val = String(fd.get(key) || "").trim();
  return val === "" ? null : val;
}

const inputBaseClass = "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white transition-colors shadow-sm";
const inputErrorClass = "border-red-500 ring-1 ring-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

export function FIRForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accused, setAccused] = useState<Accused[]>([]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCrimeTypes() {
      const res = await fetch("/api/crime-types");
      if (!res.ok) return;
      const json = await res.json();
      setCrimeTypes(json.crimeTypes || []);
    }
    loadCrimeTypes();
  }, []);

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
      complainant_name: String(fd.get("complainant_name") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      crime_type_id: String(fd.get("crime_type_id") || "").trim(),
      description: String(fd.get("description") || "").trim(),
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

    const newErrors: Record<string, string> = {};
    if (!payload.complainant_name) newErrors.complainant_name = "Complainant name is required";
    if (!payload.description) newErrors.description = "Description is required";
    if (!payload.location) newErrors.location = "Location is required";
    if (!payload.crime_type_id) newErrors.crime_type_id = "Crime type is required";
    if (payload.phone && String(payload.phone).length < 6) newErrors.phone = "Enter a valid phone number";

    setErrors(newErrors);
    setTouched({ complainant_name: true, description: true, location: true, crime_type_id: true, phone: true });
    if (Object.keys(newErrors).length > 0) return setError("Please fix the highlighted fields below.");

    setLoading(true);
    try {
      const res = await fetch("/api/firs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          setError("Please fix the highlighted fields below.");
          return;
        }
        throw new Error(json?.error || "Failed to create FIR");
      }

      setSuccess("FIR registered successfully. An official record has been created.");
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

  const SectionHeader = ({ icon: Icon, title, desc }: any) => (
    <div className="mb-6 border-b pb-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-blue-900" />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* ── Complainant Details ── */}
      <section>
        <SectionHeader icon={User} title="1. Complainant Details" desc="Personal information of the individual reporting the crime." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Complainant Full Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                name="complainant_name"
                className={cn(inputBaseClass, errors.complainant_name && inputErrorClass)}
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
              {errors.complainant_name && <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />}
            </div>
            {touched.complainant_name && errors.complainant_name && <p className="text-xs text-red-500 mt-1.5">{errors.complainant_name}</p>}
          </div>

          <div>
            <label className={labelClass}>Guardian Name</label>
            <input name="guardian_name" className={inputBaseClass} placeholder="Father/Mother/Spouse" />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className="relative">
              <input
                name="phone"
                type="tel"
                className={cn(inputBaseClass, errors.phone && inputErrorClass)}
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
              {errors.phone && <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />}
            </div>
            {touched.phone && errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" className={inputBaseClass}>
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input name="age" type="number" className={inputBaseClass} placeholder="Years" />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input name="dob" type="date" className={inputBaseClass} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Permanent Address</label>
            <input name="address" className={inputBaseClass} placeholder="House number, Street, City" />
          </div>
        </div>
      </section>

      {/* ── Incident Details ── */}
      <section>
        <SectionHeader icon={MapPin} title="2. Incident Details" desc="Specifics of where, when, and what occurred." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className={labelClass}>Date of Occurrence</label>
              <input name="date_of_occurrence" type="date" className={inputBaseClass} />
            </div>
            <div>
              <label className={labelClass}>Time of Occurrence</label>
              <input name="time_of_occurrence" type="time" className={inputBaseClass} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Exact Location of Incident <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                name="location"
                placeholder="Include landmarks if applicable"
                className={cn(inputBaseClass, errors.location && inputErrorClass)}
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
              {errors.location && <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />}
            </div>
            {touched.location && errors.location && <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>}
          </div>

          <div>
            <label className={labelClass}>Crime Type <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                name="crime_type_id"
                defaultValue=""
                className={cn(inputBaseClass, errors.crime_type_id && inputErrorClass)}
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
                <option value="" disabled>Select official crime classification...</option>
                {crimeTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}{ct.ipc_section ? ` (IPC: ${ct.ipc_section})` : ""}
                  </option>
                ))}
              </select>
            </div>
            {touched.crime_type_id && errors.crime_type_id && <p className="text-xs text-red-500 mt-1.5">{errors.crime_type_id}</p>}
          </div>

          <div>
            <label className={labelClass}>IPC Sections (Optional Override)</label>
            <input name="ipc_sections" className={inputBaseClass} placeholder="e.g. 302, 307" />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Detailed Description / Narrative <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea
                name="description"
                rows={5}
                placeholder="Provide a comprehensive narrative of the incident as reported by the complainant."
                className={cn(inputBaseClass, "resize-y", errors.description && inputErrorClass)}
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
              {errors.description && <AlertTriangle className="absolute right-3 top-4 h-4 w-4 text-red-500" />}
            </div>
            {touched.description && errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
          </div>
        </div>
      </section>

      {/* ── Accused Details ── */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-blue-900" />
              <h3 className="text-lg font-bold text-gray-900">3. Accused Details</h3>
            </div>
            <p className="text-sm text-gray-500">Known suspects or identified perpetrators.</p>
          </div>
          <button 
            type="button" 
            onClick={addAccused} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Accused
          </button>
        </div>
        
        <div className="space-y-4">
          {accused.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed rounded-lg bg-gray-50 text-gray-500 text-sm">
              No accused individuals have been added. Click "Add Accused" if there are known suspects.
            </div>
          )}
          {accused.map((a, i) => (
            <div key={i} className="p-4 bg-gray-50 border rounded-lg relative group">
              <button 
                type="button" 
                onClick={() => removeAccused(i)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove accused"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name / Alias</label>
                  <input value={a.name || ""} onChange={(e) => updateAccused(i, { name: e.target.value })} className={inputBaseClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address / Location</label>
                  <input value={a.address || ""} onChange={(e) => updateAccused(i, { address: e.target.value })} className={inputBaseClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Physical Description / Notes</label>
                  <input value={a.description || ""} onChange={(e) => updateAccused(i, { description: e.target.value })} className={inputBaseClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Property Details ── */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Box className="h-5 w-5 text-blue-900" />
              <h3 className="text-lg font-bold text-gray-900">4. Stolen/Involved Property</h3>
            </div>
            <p className="text-sm text-gray-500">Items stolen, damaged, or recovered during the incident.</p>
          </div>
          <button 
            type="button" 
            onClick={addProperty} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {properties.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed rounded-lg bg-gray-50 text-gray-500 text-sm">
              No property items added. Click "Add Item" if property was involved.
            </div>
          )}
          {properties.map((p, i) => (
            <div key={i} className="p-4 bg-gray-50 border rounded-lg relative group">
              <button 
                type="button" 
                onClick={() => removeProperty(i)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove item"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-10">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Item Description</label>
                  <input value={p.item_name || ""} onChange={(e) => updateProperty(i, { item_name: e.target.value })} className={inputBaseClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                  <input type="number" min="1" value={p.quantity ?? 1} onChange={(e) => updateProperty(i, { quantity: Number(e.target.value) })} className={inputBaseClass} />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Estimated Value (₹)</label>
                  <input type="number" step="0.01" value={p.estimated_value ?? ""} onChange={(e) => updateProperty(i, { estimated_value: e.target.value ? Number(e.target.value) : undefined })} className={inputBaseClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Submit Area ── */}
      <div className="pt-8 border-t flex items-center justify-between">
        <p className="text-xs text-gray-500 max-w-sm">
          By submitting this form, you verify that the information entered matches the complainant's statement to the best of your knowledge.
        </p>
        <button 
          type="submit" 
          disabled={loading} 
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Registering Official FIR..." : "Confirm & Register FIR"}
        </button>
      </div>
    </form>
  );
}
