export default async function runScript(script: string) {
	const res = await fetch('/vdj/query?script=' + script, {})
	return await res.text()
}
