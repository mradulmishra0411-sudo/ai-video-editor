import { useQuery, useMutation } from '@tanstack/react-query'
import { videoAPI } from '@/lib/api'

export const useVideoUpload = () => {
  return useMutation({
    mutationFn: (file: File) => videoAPI.upload(file),
  })
}

export const useVideo = (videoId: string | null) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => videoAPI.get(videoId!),
    enabled: !!videoId,
  })
}

export const useVideoAnalyze = () => {
  return useMutation({
    mutationFn: (videoId: string) => videoAPI.analyze(videoId),
  })
}

export const useVideoDownload = () => {
  return useMutation({
    mutationFn: (videoId: string) => videoAPI.download(videoId),
  })
}
