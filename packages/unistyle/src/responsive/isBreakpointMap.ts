// Only plain objects are responsive breakpoint maps (`{ xs: 1, md: 2 }`).
// Other objects — CSS results (`css\`…\``), keyframes, class instances —
// are scalar values and must reach the styles callback untouched.
const isBreakpointMap = (v: unknown): v is Record<string, unknown> => {
  if (typeof v !== 'object' || v === null) return false
  const proto = Object.getPrototypeOf(v) // arrays → Array.prototype → false
  return proto === Object.prototype || proto === null
}

export default isBreakpointMap
