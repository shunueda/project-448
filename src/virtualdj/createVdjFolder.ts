import type { PathLike } from 'node:fs'
import xml from 'xml'

export function createVdjFolder(paths: Set<PathLike>): string {
  return xml(
    {
      VirtualFolder: [
        {
          _attr: {
            noDuplicates: 'yes'
          }
        },
        ...paths.values().map(path => ({
          song: [
            {
              _attr: {
                path
              }
            }
          ]
        }))
      ]
    },
    {
      indent: ' '.repeat(2),
      declaration: {
        encoding: 'utf-8'
      }
    }
  )
}
