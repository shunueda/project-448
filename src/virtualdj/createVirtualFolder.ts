import xml from 'xml'

export function createVirtualFolder(paths: Set<string>): string {
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
