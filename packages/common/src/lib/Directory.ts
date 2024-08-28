import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirpNativeSync } from 'mkdirp'
import { name } from 'project-448/package.json'

export class Directory {
  // initialize directories
  static {
    Object.values(Directory).map(mkdirpNativeSync)
  }
  // shared
  private static vdjCustomDir = `${process.env.VIRTUAL_DJ_DIR}/${name}`
  private static root = getWorkspaceRootFromMeta(import.meta)
  // program
  static WORKSPACE_ROOT = this.root
  static LOGS = `${this.root}/logs`
  static CONFIGS = `${this.root}/configs`
  // virtualdj
  static MY_LISTS = `${process.env.VIRTUAL_DJ_DIR}/MyLists`
  static VDJ_CUSTOM_DIR = this.vdjCustomDir
  static TRACKS = `${this.vdjCustomDir}/Tracks`
  static LYRICS = `${this.vdjCustomDir}/Lyrics`
  static COVERS = `${this.vdjCustomDir}/Covers`
}

function getWorkspaceRootFromMeta(meta: ImportMeta, curr?: string): string {
  const dir = curr || dirname(fileURLToPath(meta.url))
  return existsSync(join(dir, 'pnpm-workspace.yaml'))
    ? dir
    : getWorkspaceRootFromMeta(meta, dirname(dir))
}
