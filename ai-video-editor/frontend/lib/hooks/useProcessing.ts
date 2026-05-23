import { useQuery, useMutation } from '@tanstack/react-query'
import { processingAPI } from '@/lib/api'

export const useProcessing = (taskId: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['processing', taskId],
    queryFn: () => processingAPI.getStatus(taskId!),
    enabled: !!taskId,
    refetchInterval: 2000, // Poll every 2 seconds
  })

  return {
    task: data?.data,
    isLoading,
    error,
    progress: data?.data?.progress || 0,
    status: data?.data?.status || 'pending',
  }
}

export const useStartProcessing = () => {
  return useMutation({
    mutationFn: processingAPI.start,
  })
}

export const useCancelProcessing = () => {
  return useMutation({
    mutationFn: processingAPI.cancel,
  })
}
