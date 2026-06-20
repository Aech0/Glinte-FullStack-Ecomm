// Tiny ID generator shared by both storage backends. Format: prefix_<base36 ts><6 random>.
// Not cryptographically secure — only used for non-secret identifiers.
export function genId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
