import Docker from "dockerode"

const docker = new Docker({
  socketPath: "/var/run/docker.sock"
})

export async function listContainers() {
  const containers = await docker.listContainers({ all: true })

  return containers.map((c) => ({
    id: c.Id,
    name: c.Names[0].replace("/", ""),
    image: c.Image,
    state: c.State,
    status: c.Status,
    ports: c.Ports
  }))
}
