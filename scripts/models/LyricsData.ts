export default interface LyricsData {
	lyrics: {
		syncType: 'LINE_SYNCED' | 'UNSYNCED'
		lines: Array<{
			startTimeMs: string
			words: string
			syllables: string[]
			endTimeMs: string
		}>
		provider: string
		providerLyricsId: string
		providerDisplayName: string
		syncLyricsUri: string
		isDenseTypeface: boolean
		alternatives: unknown[]
		language: string
		isRtlLanguage: boolean
		fullscreenAction: string
		showUpsell: boolean
	}
	colors: {
		background: number
		text: number
		highlightText: number
	}
	hasVocalRemoval: boolean
}
