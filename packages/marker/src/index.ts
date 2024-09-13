import { readFileSync, writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { join } from 'node:path'
import { ensureVirtualDjState } from 'common'
import { Directory } from 'common'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import type { CuePoi, SongMetadata } from './schema'

await ensureVirtualDjState({
  active: false
})

const parser = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: true,
  attributeNamePrefix: '',
  parseAttributeValue: true
})

const databaseXml = parser.parse(
  readFileSync(join(Directory.VDJ_DIR, 'database.xml'))
)

const metadataWithCues: SongMetadata[] = (
  databaseXml.VirtualDJ_Database.Song as SongMetadata[]
).map(metadata => {
  // Exclude non-track files
  if (!metadata.FilePath.includes(Directory.TRACKS)) {
    return metadata
  }
  // Exclude tracks with cues
  if (metadata.Poi.some(it => it.Type === 'cue')) {
    return metadata
  }
  // Exclude tracks with no beatgrid
  const beatgridPoi = metadata.Poi.find(it => it.Type === 'beatgrid')
  if (!beatgridPoi) {
    return metadata
  }
  const beatgrid = beatgridPoi.Pos
  const bpm = metadata.Scan.Bpm
  /**
   * Assuming a typical song structure:
   *
   * Intro: 4 (measures)
   * Verse: 16
   * [Cue 1] Pre-Chorus: 8
   * Chorus: 16
   * Verse: 16
   * [Cue 2] Pre-Chorus: 8
   * Chorus: 16
   * [Cue 3] Bridge: 8
   * Chorus: 16
   * Outro: 4
   */
  const cues: CuePoi[] = [...new Array(4).keys()].map(it => {
    return {
      Pos: beatgrid + bpm * 4 * it,
      Type: 'cue',
      Num: it + 1
    }
  })
  metadata.Poi.push(...cues)
  return metadata
})

databaseXml.VirtualDJ_Database.Song = metadataWithCues

const databaseXmlWithCues = new XMLBuilder({
  attributeNamePrefix: '',
  ignoreAttributes: false,
  format: true,
  suppressEmptyNode: true
}).build(databaseXml)

const XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>'
writeFileSync('a.xml', [XML_HEADER, databaseXmlWithCues].join(EOL))
