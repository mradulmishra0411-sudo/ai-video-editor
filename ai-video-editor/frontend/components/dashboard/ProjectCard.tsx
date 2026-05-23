'use client'

import Link from 'next/link'
import { format } from 'date-fns'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    thumbnail?: string
    status: 'completed' | 'processing' | 'failed'
    createdAt: string
    duration?: number
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColor = {
    completed: 'text-green-500',
    processing: 'text-yellow-500',
    failed: 'text-red-500',
  }

  return (
    <Link href={`/editor/${project.id}`}>
      <div className="bg-secondary rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground">📹</div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          
          <div className="flex items-center justify-between mt-3">
            <span className={`text-sm font-medium ${statusColor[project.status]}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(project.createdAt), 'MMM dd')}
            </span>
          </div>

          {project.duration && (
            <p className="text-xs text-muted-foreground mt-2">
              Duration: {Math.round(project.duration / 60)}s
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
