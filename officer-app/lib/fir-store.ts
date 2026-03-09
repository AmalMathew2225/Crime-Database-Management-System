// Shared in-memory FIR store — module-level singleton persists across requests
// while the Next.js server process is running.
export const runtimeFirs: any[] = [];

// In-memory store for case notes, keyed by fir_id
export const runtimeNotes: Record<string, any[]> = {};

// In-memory store for evidence, keyed by fir_id
export const runtimeEvidence: Record<string, any[]> = {};
