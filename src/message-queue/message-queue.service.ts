import { Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
import { EventPattern, RmqContext } from '@nestjs/microservices';

// @Injectable()
// export class MessageQueueService {
//   // handleUserCreatedEvent(payload: { email: string; name: string }) {
//   //   console.log(`Welcome message sent to ${payload.email}`);
//   // }
//   // @OnEvent('user_created')
//   @EventPattern('user_created')
//   handleWelcomeMessage(data: any, context: RmqContext) {
//     const channel = context.getChannelRef();
//     const originalMsg = context.getMessage();

//     // Send welcome email logic here
//     console.log(`Sending welcome message to ${data.email}`);

//     // Acknowledge the message
//     channel.ack(originalMsg);
//   }
// }

@Injectable()
export class MessageQueueService {
  @EventPattern('user_created')
  handleWelcomeMessage(data: any, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Send welcome email logic here
      console.log(`Sending welcome message to ${data.email}`);

      // Acknowledge the message (marks as completed and removes from queue)
      channel.ack(originalMsg);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Reject and requeue if there's an error
      channel.nack(originalMsg, false, true);
      // Or reject and don't requeue
      // channel.nack(originalMsg, false, false);
    }
  }
}
