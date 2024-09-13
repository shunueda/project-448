export class StringUtils {
  static EMPTY = ''

  static orEmpty(str: string | null | undefined) {
    return str ?? StringUtils.EMPTY
  }
}
