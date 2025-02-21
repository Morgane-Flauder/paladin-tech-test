import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HealthReport } from '../../health-reports/entities/health-report.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName: string;

  @OneToMany(() => HealthReport, (healthReport) => healthReport.client)
  healthReports: HealthReport[];
}
