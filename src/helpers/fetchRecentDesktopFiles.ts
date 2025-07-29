import { DESKTOP_PATH } from "../config/static.ts"
import fs from 'fs'
import path from 'path'

export const fetchRecentDesktopFiles = (setRecentFiles: (v: string[]) => void) => {
  const files = fs.readdirSync(DESKTOP_PATH)
  const lastDayFiles = files.filter(file => {
    const fullPath = path.join(DESKTOP_PATH, file)
    const stat = fs.statSync(fullPath)
    const created = new Date(stat.birthtime)
    return (Date.now() - created.getTime()) < 1000 * 60 * 60 * 24
  })
  setRecentFiles(lastDayFiles)
}