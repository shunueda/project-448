import find from 'find-process'

interface Props {
  active: boolean
}

export async function ensureVirtualDjState({ active }: Props) {
  const pids = await find('name', 'VirtualDJ')
  if (active && pids.length === 0) {
    throw new Error('VirtualDJ is not running')
  }
  if (!active && pids.length > 0) {
    throw new Error('VirtualDJ is running')
  }
}
