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

export enum SyncType {
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
          Number.parseInt(it.toString())
        ),
        words: string(),
        syllables: array(string()),
        endTimeMs: union([number(), string()]).transform(it =>
          Number.parseInt(it.toString())
        )
      })
    ),
    provider: string(),
    providerLyricsId: string(),
    providerDisplayName: string(),
    syncLyricsUri: string(),
    isDenseTypeface: boolean(),
    alternatives: array(unknown()),
    language: string(),
    isRtlLanguage: boolean(),
    showUpsell: boolean(),
    capStatus: string(),
    isSnippet: boolean()
  }),
  colors: object({
    background: number(),
    text: number(),
    highlightText: number()
  }),
  hasVocalRemoval: boolean()
})
