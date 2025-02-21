import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Client } from '../../clients/entities/client.entity';

@Entity('health_reports')
export class HealthReport {
  @PrimaryColumn()
  year: number;

  @PrimaryColumn({ type: 'int', name: 'client_id' })
  @ManyToOne(() => Client, (client) => client.healthReports)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  guidance: string;
}
