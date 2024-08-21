import {
  array,
  boolean,
  nativeEnum,
  number,
  object,
  string,
  union,
  unknown,
  type z
} from 'zod'

enum SyncType {
  LINE_SYNCED = 'LINE_SYNCED',
  UNSYNCED = 'UNSYNCED'
}

export type LyricsData = z.infer<typeof lyricsDataSchema>

export const lyricsDataSchema = object({
  lyrics: object({
    syncType: nativeEnum(SyncType),
    lines: array(
      object({
        startTimeMs: union([number(), string()]).transform(it =>
          Number.parseInt(it.toString(), 10)
        ),
        words: string(),
        syllables: array(string()),
        endTimeMs: union([number(), string()])
          .transform(it => Number.parseInt(it.toString(), 10))
          .optional() // To handle cases where endTimeMs is 0 or missing
      })
    ),
    provider: string(),
    providerLyricsId: string(),
    providerDisplayName: string(),
    syncLyricsUri: string().optional(), // This field is empty in your data, so mark it as optional
    isDenseTypeface: boolean(),
    alternatives: array(unknown()),
    language: string(),
    isRtlLanguage: boolean(),
    showUpsell: boolean(),
    capStatus: string().optional(), // Add this field since it's in your data
    isSnippet: boolean()
  }),
  colors: object({
    background: number(),
    text: number(),
    highlightText: number()
  }),
  hasVocalRemoval: boolean()
})
