import React, { useEffect, useState } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import { prisma } from '../db.ts'
import { generateProject } from '../generate.ts'

export default function App() {
  const [projects, setProjects] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const { exit } = useApp()

  const fetchProjects = async () => {
    const all = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const last24h = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    setProjects(all)
    setRecent(last24h)
  }

  const createProject = async () => {
    await prisma.project.create({ data: generateProject() })
    await fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useInput((input, key) => {
    if (key.ctrl && input === 'n') createProject()
    if (key.ctrl && input === 'r') fetchProjects()
    if (key.return) {
      console.log('→ Перехід до проєкту (Enter натиснуто)')
    }
    if (input === 'q') exit()
  })

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      {/* Верхній рядок */}
      <Box flexDirection="row" gap={2}>
        <Box borderStyle="round" borderColor="red" padding={1} width="50%">
          <Text>
            Червоне (поля):
            {'\n'}field0: random()
            {'\n'}field1: random()
          </Text>
        </Box>
        <Box borderStyle="round" borderColor="blue" padding={1} width="50%">
          <Text>
            Сині (останні 24г):
            {'\n'}
            {recent.map(p => `• ${p.field0}`).join('\n') || 'Немає'}
          </Text>
        </Box>
      </Box>

      {/* Нижній рядок */}
      <Box flexDirection="row" gap={2}>
        <Box borderStyle="round" borderColor="green" padding={1} width="70%">
          <Text>
            Зелені (всі проєкти):
            {'\n'}
            {projects.map(p => `• ${p.field0}`).join('\n') || 'Немає'}
          </Text>
        </Box>
        <Box borderStyle="round" borderColor="yellow" padding={1} width="30%">
          <Text>
            Помаранчеве (гарячі клавіші):
            {'\n'}Ctrl+N — Створити
            {'\n'}Ctrl+R — Оновити
            {'\n'}Enter — Перейти
            {'\n'}Q — Вийти
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
