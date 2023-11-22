export default function getTextLineCount(element: HTMLElement): number {
	const divHeight = element.offsetHeight
	const lineHeight = parseInt(element.style.lineHeight)
	return divHeight / lineHeight
}
