import path from 'path'
import fs from 'fs'
import { Dispatch, SetStateAction } from 'react'
import { Project } from '@prisma/client'
import { DESKTOP_PATH } from '../config/static.ts'
import { createProject } from './createProject.ts'

type DraftProject = Omit<Project, 'id'>

export const saveDraftProject = async (
  draftProject: DraftProject | undefined,
  setCreatingProject: Dispatch<SetStateAction<boolean>>,
  fetchProjects: (setProjects: Dispatch<SetStateAction<Project[]>>) => void,
  setProjects: Dispatch<SetStateAction<Project[]>>
) => {
  if (!draftProject) return

  await createProject(draftProject)

  setCreatingProject(false)
  fetchProjects(setProjects)
}
