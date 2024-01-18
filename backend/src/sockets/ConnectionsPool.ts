import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';

@Injectable()
export class ConnectionsPool {
  private socketUserTable: Record<Socket['id'], User['id'] | null>;
  private userSocketTable: Record<User['id'], Socket['id']>;

  constructor() {
    this.socketUserTable = {};
    this.userSocketTable = {};
  }

  registerConnection(socketId: Socket['id'], userId: User['id']) {
    if (!this.socketUserTable[socketId] && !this.userSocketTable[userId]) {
      this.socketUserTable[socketId] = userId;
      this.userSocketTable[userId] = socketId;
    }
  }

  destroyConnection(socketId: Socket['id']) {
    if (this.socketUserTable[socketId] !== null)
      delete this.userSocketTable[this.socketUserTable[socketId]!];
    delete this.socketUserTable[socketId];
  }

  getUserIdBy({ socketId }: { socketId: Socket['id'] }) {
    if (!this.socketUserTable[socketId]) {
      throw new Error('No such socketId connection');
    }

    return this.socketUserTable[socketId];
  }

  getSocketIdBy({ userId }: { userId: User['id'] }) {
    if (!this.userSocketTable[userId]) {
      throw new Error('No such userId connection');
    }

    return this.userSocketTable[userId];
  }
}
