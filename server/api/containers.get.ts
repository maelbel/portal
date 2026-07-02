export default defineCachedEventHandler(
  async () => {
    return await listContainers()
  },
  {
    maxAge: 5,
    swr: true,
    name: 'containers-list'
  }
)
