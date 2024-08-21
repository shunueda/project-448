import xml from 'xml'
import { Charset } from '../lib/Charset'

export function createVirtualFolderFromPaths(paths: string[]) {
  return xml(
    {
      VirtualFolder: [
        { _attr: { noDuplicates: 'yes' } },
        ...paths.map(path => ({
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
        encoding: Charset.UTF_8
      }
    }
  )
}
