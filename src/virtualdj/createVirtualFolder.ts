import xml from 'xml'

export function createVirtualFolder(paths: string[]): string {
  return xml(
    {
      VirtualFolder: [
        {
          _attr: {
            noDuplicates: 'yes'
          }
        },
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
        encoding: 'utf-8'
      }
    }
  )
}
