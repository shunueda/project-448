import { readFileSync } from 'node:fs'
import { load } from 'js-yaml'
import { Project } from 'ts-morph'

export function yamlTypeGen(filename: string) {
  const content = readFileSync(filename, 'utf-8')
  const parsedYaml = load(content)
  const defaultExportedJson = `export default ${JSON.stringify(parsedYaml, null, 2)} as const;`
  const project = new Project({
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true
    }
  })
  project.createSourceFile(filename.replace('.yaml', '.ts'), defaultExportedJson, { overwrite: true })
  project.emitSync()
}
