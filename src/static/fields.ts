import { Project } from "@prisma/client";

export const fields: (keyof Omit<Project, 'id'>)[] = ['name', 'field0', 'field1', 'field2']
