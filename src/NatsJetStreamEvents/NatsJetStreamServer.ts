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
        try {
          for await (const msg of messages) {
            try {
              const data = JSON.parse(this.sc.decode(msg.data));
              await handler(data);
              msg.ack();
            } catch {
              msg.nak();
            }
          }
        } catch {}
      })();
    }

    callback();
  }

  public async close() {}
}
