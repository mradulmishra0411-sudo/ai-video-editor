import { useQuery, useMutation } from '@tanstack/react-query'
import { projectAPI } from '@/lib/api'

export const useProject = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectAPI.get(projectId!),
    enabled: !!projectId,
  })
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectAPI.list(),
  })
}

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      projectAPI.create(data),
  })
}
