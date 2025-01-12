import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MessageQueueModule } from './message-queue/message-queue.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessageQueueModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.MESSAGE_QUEUE_URL || 'amqp://127.0.0.1:5672'],
        queue: process.env.MESSAGE_QUEUE_QUEUE || 'demo_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  console.log('Microservice is listening');
}
bootstrap();
