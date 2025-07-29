export const randomString = () => Math.random().toString(36).substring(2, 8)

export const generateProject = () => ({
  field0: randomString(),
  field1: randomString(),
})
