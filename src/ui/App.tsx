import { useEffect, useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { Project } from '@prisma/client'
import { fetchProjects } from '../helpers/fetchProjects.ts'
import { fetchRecentDesktopFiles } from '../helpers/fetchRecentDesktopFiles.ts'
import { generateSystemData } from '../helpers/generateSystemData.ts'
import { saveDraftProject } from '../helpers/saveDraftProject.ts'
import { fields } from '../static/fields.ts'

const App = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [recentFiles, setRecentFiles] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [systemInfo, setSystemInfo] = useState<{ field0: string, field1: string, field2: string }>()
  const [creatingProject, setCreatingProject] = useState<boolean>(false)
  const [draftProject, setDraftProject] = useState<Omit<Project, 'id'>>()
  const [editFieldIndex, setEditFieldIndex] = useState<number>(0)

  useInput((input, key) => {
    if (creatingProject) {
      const field = fields[editFieldIndex]

      const isBackspace =
        key.backspace ||
        input === '\b' ||
        input === '\x7f' ||
        input.charCodeAt(0) === 127

      if (isBackspace) {
        setDraftProject(p => {
          if (!p) return p
          if (field === 'createdAt') return p
          return {
            ...p,
            [field]: (p[field] as string)?.slice(0, -1) ?? ''
          }
        })
        return
      }

      if (key.return) {
        setEditFieldIndex(i => Math.min(i + 1, fields.length - 1))
        return
      }

      if (key.upArrow) {
        setEditFieldIndex(i => Math.max(i - 1, 0))
        return
      }

      if (key.downArrow) {
        setEditFieldIndex(i => Math.min(i + 1, fields.length - 1))
        return
      }

      if (key.ctrl && input === 's') {
        saveDraftProject(
          draftProject,
          setCreatingProject,
          fetchProjects,
          setProjects
        )
        return
      }

      if (input && input.length === 1 && !key.ctrl && !key.meta) {
        setDraftProject(p => {
          if (!p) return p
          if (field === 'createdAt') return p
          return {
            ...p,
            [field]: (p[field] ?? '') + input
          }
        })
      }

      return
    }

    if (key.ctrl && input === 'n') {
      const now = new Date()
      setDraftProject({
        name: '',
        field0: '',
        field1: '',
        field2: '',
        createdAt: now
      })
      setEditFieldIndex(0)
      setCreatingProject(true)
    }

    if (key.ctrl && input === 'r') {
      fetchRecentDesktopFiles(setRecentFiles)
      generateSystemData(setSystemInfo)
    }

    if (key.return) {
      const project = projects[selectedIndex]
      if (project) {
        console.clear()
        console.log('File from Desktop:', project)
      }
    }

    if (key.upArrow) setSelectedIndex(i => Math.max(i - 1, 0))
    if (key.downArrow) setSelectedIndex(i => Math.min(i + 1, projects.length - 1))
  })

  useEffect(() => {
    fetchProjects(setProjects)
    fetchRecentDesktopFiles(setRecentFiles)
    generateSystemData(setSystemInfo)
  }, [])

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row" gap={1}>
        <Box borderStyle="round" borderColor="red" padding={1} flexDirection="column" flexGrow={1}>
          <Text>🔴 System info</Text>
          {systemInfo && (
            <>
              <Text>{systemInfo.field0}</Text>
              <Text>{systemInfo.field1}</Text>
              <Text>{systemInfo.field2}</Text>
            </>
          )}
        </Box>

        <Box borderStyle="round" borderColor="blue" padding={1} flexDirection="column" flexGrow={1}>
          <Text>🔵 New files (24 h)</Text>
          {recentFiles.map((file, idx) => (
            <Text key={idx}>• {file}</Text>
          ))}
        </Box>

        <Box borderStyle="round" borderColor="yellow" padding={1} flexDirection="column" flexGrow={1}>
          <Text>🟠 Commands:</Text>
          <Text>ctrl-n — create new project</Text>
          <Text>ctrl-s — save project</Text>
          <Text>ctrl-r — update data</Text>
        </Box>
      </Box>

      {creatingProject ? (
        <Box borderStyle="round" borderColor="magenta" padding={1} flexDirection="column" marginTop={1}>
          <Text>🟣 New project:</Text>
          {fields.map((field, idx) => (
            <Text key={field} inverse={editFieldIndex === idx}>
              {field}: {draftProject
                ? (draftProject[field] instanceof Date
                  ? draftProject[field].toLocaleString()
                  : draftProject[field])
                : ''}
              {editFieldIndex === idx && ' ← Write here'}
            </Text>
          ))}
        </Box>
      ) : (
        <Box borderStyle="round" borderColor="green" padding={1} flexDirection="column" marginTop={1} flexGrow={1}>
          <Text>🟢 All projects:</Text>
          {projects.map((project, idx) => (
            <Text key={project.id} inverse={idx === selectedIndex}>
              {project.name} — {project.createdAt.toLocaleString()}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default App
