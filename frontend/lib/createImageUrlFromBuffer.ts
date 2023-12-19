import ImageBufferData from '@/lib/models/ImageBufferData'

export default function createImageUrlFromBuffer(buffer: ImageBufferData) {
  if (!buffer || !buffer.data) {
    return ''
  }
  const byteArray = new Uint8Array(buffer.data)
  const blob = new Blob([byteArray], { type: 'image/jpeg' })
  return URL.createObjectURL(blob)
}