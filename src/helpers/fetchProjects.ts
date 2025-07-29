import fs from 'fs'
import { DESKTOP_PATH } from '../config/static.ts'
import { Project } from '@prisma/client'
import path from 'path'

export const fetchProjects = async (setProjects: (v: Project[]) => void) => {
  const files = fs.readdirSync(DESKTOP_PATH)
  const allFiles: Project[] = files.map((file, idx) => {
    const fullPath = path.join(DESKTOP_PATH, file)
    const stat = fs.statSync(fullPath)

    return {
      id: `local-${idx}`,
      name: file,
      field0: stat.isDirectory() ? 'folder' : 'file',
      field1: `${stat.size} bytes`,
      field2: stat.birthtime.toISOString(),
      createdAt: stat.birthtime
    }
  })

  setProjects(allFiles)
}
