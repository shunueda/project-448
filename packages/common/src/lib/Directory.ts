import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { name } from 'project-448/package.json'

export class Directory {
  // shared
  private static vdjCustomDir = `${process.env.VIRTUAL_DJ_DIR}/${name}`
  private static root = getWorkspaceRootFromMeta(import.meta)

  // program
  public static WORKSPACE_ROOT = this.root
  public static LOGS = `${this.root}/logs`
  public static CONFIGS = `${this.root}/configs`

  // virtualdj
  public static VDJ_DIR = process.env.VIRTUAL_DJ_DIR
  public static MY_LISTS = `${process.env.VIRTUAL_DJ_DIR}/MyLists`
  public static VDJ_CUSTOM_DIR = this.vdjCustomDir
  public static TRACKS = `${this.vdjCustomDir}/Tracks`
  public static LYRICS = `${this.vdjCustomDir}/Lyrics`
  public static COVERS = `${this.vdjCustomDir}/Covers`

  // initialize directories
  static {
    Object.values(Directory).forEach(it => mkdirSync(it, { recursive: true }))
  }
}

function getWorkspaceRootFromMeta(meta: ImportMeta, curr?: string): string {
  const dir = curr || dirname(fileURLToPath(meta.url))
  return existsSync(join(dir, 'pnpm-workspace.yaml'))
    ? dir
    : getWorkspaceRootFromMeta(meta, dirname(dir))
}
