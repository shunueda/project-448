export default async function runScript(script: string) {
	const res = await fetch('http://127.0.0.1:2000/query?script=' + script)
	return await res.text()
}
