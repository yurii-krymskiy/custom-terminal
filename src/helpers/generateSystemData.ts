import os from 'os'

export const generateSystemData = (setSystemInfo: (v: { field0: string, field1: string, field2: string }) => void) => {
    setSystemInfo({
      field0: `CPU: ${os.cpus()[0].model}`,
      field1: `MEM: ${(os.totalmem() / 1024 / 1024).toFixed(0)}MB`,
      field2: `Platform: ${os.platform()}`
    })
  }
