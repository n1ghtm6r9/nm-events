import { Inject, Injectable } from '@nestjs/common';
import { connect, StringCodec, RetentionPolicy, StorageType } from 'nats';
import { nanos } from 'nats';
import { configKey, IConfig } from '@nmxjs/config';
import { NatsJetStreamServer } from '../NatsJetStreamServer';
import type { IEventsClient } from '../../EventsClient';

@Injectable()
export class CreateNatsJetStreamClientService {
  constructor(@Inject(configKey) protected config: IConfig) {}

  public async call(): Promise<IEventsClient> {
    const nc = await connect({
      servers: this.config.event.servers.map(v => `nats://${v.host || '127.0.0.1'}:${v.port || 4222}`),
      user: this.config.event.username,
      pass: this.config.event.password,
    });

    const jsm = await nc.jetstreamManager();
    const js = nc.jetstream();
    const sc = StringCodec();

    const streamName = this.config.event.streamName || 'EVENTS';
    await jsm.streams
      .add({
        name: streamName,
        subjects: [`${streamName}.>`],
        retention: RetentionPolicy.Limits,
        max_age: nanos(7 * 24 * 60 * 60 * 1000),
        storage: StorageType.File,
      })
      .catch(() => {
        return jsm.streams.update(streamName, { subjects: [`${streamName}.>`] });
      });

    return {
      options: {
        strategy: new NatsJetStreamServer(nc, js, jsm, this.config.event),
      },
      emit: async ({ topic, data }) => {
        await js.publish(`${streamName}.${topic}`, sc.encode(JSON.stringify(data)));
      },
      close: async () => {
        await nc.drain();
      },
    };
  }
}
