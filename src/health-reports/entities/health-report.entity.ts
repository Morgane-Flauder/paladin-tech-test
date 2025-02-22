import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Client } from '../../clients/entities/client.entity';

export const guidanceOptions = ['positive', 'negative'] as const;
export type Guidance = (typeof guidanceOptions)[number];

@Entity('health_reports')
export class HealthReport {
  @PrimaryColumn()
  year: number;

  @PrimaryColumn({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.healthReports)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  guidance: Guidance;
}
