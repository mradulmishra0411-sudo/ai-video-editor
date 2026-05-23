import { create } from 'zustand'

interface Project {
  id: string
  name: string
  status: 'draft' | 'processing' | 'completed'
  createdAt: string
}

interface ProjectStore {
  projects: Project[]
  currentProjectId: string | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (id: string) => void
  addProject: (project: Project) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProjectId: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (id) => set({ currentProjectId: id }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
}))
