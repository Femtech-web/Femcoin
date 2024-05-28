import http from 'http'
import { IConfig } from '../../config/config.interface'

export default function serverConfig(server: http.Server, config: IConfig) {
  server.listen(config.port, () => {
    console.log(`server is running on port ${config.port}`)
  });
}