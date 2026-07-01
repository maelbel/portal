import { listContainers } from "../utils/docker"

export default defineEventHandler(async () => {
  return await listContainers()
})
