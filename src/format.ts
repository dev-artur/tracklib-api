export function formatDuration(seconds: number): string {
    if (seconds <= 0) throw new Error("Duration must be positive");
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}