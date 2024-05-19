export function lerp_value(start: number, end: number, progress: number): number {
  return end * progress + start * (1 - progress);
}
