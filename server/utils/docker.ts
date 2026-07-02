import Docker from 'dockerode'

export interface ContainerSummary {
  id: string
  name: string
  image: string
  state: string
  status: string
  ports: Docker.Port[]
}

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
})

export async function listContainers(): Promise<ContainerSummary[]> {
  const containers = await docker.listContainers({ all: true })

  return containers.map(container => ({
    id: container.Id,
    name: (container.Names?.[0] ?? '').replace(/^\/+/, ''),
    image: container.Image,
    state: container.State,
    status: container.Status,
    ports: container.Ports
  }))
}
