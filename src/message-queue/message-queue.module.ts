import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageQueueService } from './message-queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.MESSAGE_QUEUE || 'MESSAGE_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.MESSAGE_QUEUE_URL || 'amqp://127.0.0.1:5672'],
          queue: process.env.MESSAGE_QUEUE_QUEUE || 'demo_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [MessageQueueService],
  exports: [ClientsModule],
})
export class MessageQueueModule {}
