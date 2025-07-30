import { Project } from "@prisma/client"
import { prisma } from "../db.ts"

export const createProject = async (project: Omit<Project, 'id'>) => {
  return await prisma.project.create({
    data: project
  })
}
