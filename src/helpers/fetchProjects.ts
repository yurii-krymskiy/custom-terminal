import { Project } from "@prisma/client"
import { prisma } from "../db.ts"

export const fetchProjects = async (setProjects: (v: Project[]) => void) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    })
    setProjects(projects)
  } catch (error) {
    console.error("Error fetching projects from DB:", error)
    setProjects([])
  }
}
