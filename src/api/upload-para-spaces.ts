import axios from 'axios'

export interface AnexoUploadado {
  path: string
  mime: string
  bytes: number
}

export async function uploadArquivoParaSpaces(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
    transformRequest: [(data) => data],
    onUploadProgress: onProgress
      ? (e) => {
          const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0
          onProgress(Math.min(percent, 99))
        }
      : undefined,
  })
}
