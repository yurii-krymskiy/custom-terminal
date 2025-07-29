import path from 'path'
import fs from 'fs'
import { Dispatch, SetStateAction } from 'react'
import { Project } from '@prisma/client'
import { DESKTOP_PATH } from '../config/static.ts'

type DraftProject = Omit<Project, 'id'>

export const saveDraftProject = (
  draftProject: DraftProject | undefined,
  setCreatingProject: Dispatch<SetStateAction<boolean>>,
  fetchProjects: (setProjects: Dispatch<SetStateAction<Project[]>>) => void,
  setProjects: Dispatch<SetStateAction<Project[]>>
): void => {
  if (!draftProject) return

  const filePath = path.join(DESKTOP_PATH, `${draftProject.name || 'Project'}.json`)
  fs.writeFileSync(filePath, JSON.stringify(draftProject, null, 2), 'utf8')

  setCreatingProject(false)
  fetchProjects(setProjects)
}
