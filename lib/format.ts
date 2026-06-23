/* ==========================================================================
   Breakaway Funnel — formatting & validation helpers
   Ported verbatim from the source mockups so behavior matches exactly.
   ========================================================================== */

/** Format raw digits into "(416) 555-0142" as the user types. */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 10);
  let out = "";
  if (d.length > 0) out = "(" + d.slice(0, 3);
  if (d.length >= 4) out += ") " + d.slice(3, 6);
  if (d.length >= 7) out += "-" + d.slice(6, 10);
  return out;
}

/** True when the string contains exactly 10 phone digits. */
export function isCompletePhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 10;
}

/** Loose email check, identical to the source mockups. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Join names into "A", "A & B", or "A, B & C". */
export function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return names.join(" & ");
  return names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
}

/**
 * Locale thousands grouping. Whole dollars render clean ("1,600"); any amount
 * with cents always shows two decimal places ("11.30", not "11.3").
 */
export function money(n: number): string {
  return Number.isInteger(n)
    ? n.toLocaleString("en-CA")
    : n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
