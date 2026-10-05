export function money(v) { return Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 }); }
export function cleanUser(row) { if (!row) return null; const { password_hash, ...safe } = row; return safe; }
