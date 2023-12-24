import { Global, Module } from '@nestjs/common';
import SocketsService from './sockets.service';
import { ConnectionsPool } from './ConnectionsPool';

@Global()
@Module({
  providers: [SocketsService, ConnectionsPool],
})
export class SocketsModule {}
