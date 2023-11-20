export default async function fetchJson<T>(
	url: Parameters<typeof fetch>[0],
	options?: Parameters<typeof fetch>[1]
) {
	const res = await fetch(url, options)
	console.log(await res.text())
	return (await res.json()) as T
}
