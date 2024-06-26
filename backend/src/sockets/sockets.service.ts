import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { jwtDecode } from 'jwt-decode';

import { OnEvent } from '@nestjs/event-emitter';
import { ConnectionsPool } from './ConnectionsPool';
import { Events } from 'src/events';
import { plainToInstance } from 'class-transformer';
import { UserLeveledUpResponseDto } from './dto';
import { calculateExperienceForNextLevel } from 'src/utils/levels';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export default class SocketsService implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private connectionsPool: ConnectionsPool) {}

  handleDisconnect(client: Socket) {
    this.connectionsPool.destroyConnection(client.id);
  }

  @SubscribeMessage('identity')
  handleIdentity(
    @ConnectedSocket() client: Socket,
    @MessageBody('jwt') jwt: string,
  ) {
    const user = jwtDecode<User>(jwt);
    this.connectionsPool.registerConnection(client.id, user.id);
  }

  @OnEvent(Events.APP.userLevelUp)
  handleUserLevelUp(
    event: InstanceType<typeof Events.PAYLOADS.UserLevelUpEventPayload>,
  ) {
    const { id: userId } = event.user;
    const clientId = this.connectionsPool.getSocketIdBy({ userId });

    const response = plainToInstance(
      UserLeveledUpResponseDto,
      {
        ...event.user,
        requiredPointsForNextLevel: calculateExperienceForNextLevel(
          event.user.level,
        ),
      },
      {
        excludeExtraneousValues: true,
      },
    );

    this.server.to(clientId).emit(Events.APP.userLevelUp, response);
  }

  @OnEvent(Events.APP.userChangeInXP)
  handleUserChangeInXp(
    event: InstanceType<
      typeof Events.PAYLOADS.UserAnsweredCorrectlyEventPayload
    >,
  ) {
    const { id: userId } = event.user;
    const clientId = this.connectionsPool.getSocketIdBy({ userId });

    const response = plainToInstance(
      UserLeveledUpResponseDto,
      {
        ...event.user,
        requiredPointsForNextLevel: calculateExperienceForNextLevel(
          event.user.level,
        ),
      },
      {
        excludeExtraneousValues: true,
      },
    );

    this.server.to(clientId).emit(Events.APP.userChangeInXP, response);
  }
}
