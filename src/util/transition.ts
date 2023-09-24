function easeInOut(t: number): number {
	return t * t * (3 - 2 * t)
}

export default function transition(
	a: number,
	b: number,
	frames: number
): number[] {
	if (a >= b) {
		throw new Error("Argument 'a' should be less than 'b'")
	}

	const result: number[] = []
	for (let i = 0; i < frames; i++) {
		const t = i / (frames - 1) // Normalize time to [0, 1]
		const easedT = easeInOut(t)
		result.push(a + easedT * (b - a))
	}
	return result
}
