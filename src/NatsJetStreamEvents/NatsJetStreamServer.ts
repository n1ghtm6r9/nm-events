import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { JetStreamClient, JetStreamManager, NatsConnection, StringCodec, AckPolicy, DeliverPolicy, ConsumerConfig } from 'nats';
import type { IEventConfig } from '@nmxjs/config';

export class NatsJetStreamServer extends Server implements CustomTransportStrategy {
  protected sc = StringCodec();

  constructor(
    protected nc: NatsConnection,
    protected js: JetStreamClient,
    protected jsm: JetStreamManager,
    protected eventConfig: IEventConfig,
  ) {
    super();
  }

  async listen(callback: () => void) {
    const streamName = this.eventConfig.streamName || 'EVENTS';
    const durableName = this.eventConfig.durableName || 'default';

    for (const [pattern, handler] of this.messageHandlers) {
      const subject = `${streamName}.${pattern}`;
      const consumerName = `${durableName}_${pattern}`;

      const consumerConfig: Partial<ConsumerConfig> = {
        durable_name: consumerName,
        filter_subject: subject,
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.New,
        max_deliver: this.eventConfig.maxDeliver || 3,
      };

      try {
        await this.jsm.consumers.add(streamName, consumerConfig);
      } catch {
        await this.jsm.consumers.update(streamName, consumerName, consumerConfig);
      }

      const consumer = await this.js.consumers.get(streamName, consumerName);
      const messages = await consumer.consume();

      (async () => {
        for await (const msg of messages) {
          try {
            const data = JSON.parse(this.sc.decode(msg.data));

            let currentHandler = handler;
            while (currentHandler) {
              await currentHandler({ pattern, data }, msg);
              currentHandler = currentHandler.next;
            }

            msg.ack();
          } catch (err) {
            msg.nak();
          }
        }
      })();
    }

    callback();
  }

  public async close() {}
}
