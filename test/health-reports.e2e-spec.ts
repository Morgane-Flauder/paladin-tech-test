import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { Client } from '../src/clients/entities/client.entity';
import { HealthReport } from '../src/health-reports/entities/health-report.entity';

describe('HealthReportsController (e2e)', () => {
  let app: INestApplication<App>;
  let healthReportRepo: Repository<HealthReport>;
  let clientRepo: Repository<Client>;

  let clientId: number;
  let clientFirstName: string;
  let clientLastName: string;

  const missingClientId = 999;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    healthReportRepo = moduleFixture.get<Repository<HealthReport>>(
      getRepositoryToken(HealthReport),
    );
    clientRepo = moduleFixture.get<Repository<Client>>(
      getRepositoryToken(Client),
    );

    const newClient = new Client();
    newClient.firstName = 'John';
    newClient.lastName = 'Doe';

    const client = await clientRepo.save(newClient);
    clientId = client.id;
    clientFirstName = client.firstName;
    clientLastName = client.lastName;

    await app.init();
  });

  afterEach(async () => {
    // Delete the client's health reports created for the tests
    await healthReportRepo.delete({ clientId });
  });

  afterAll(async () => {
    await clientRepo.delete(clientId);
    await app.close();
  });

  describe('GET /clients/:clientId/health-reports', () => {
    it('should return an empty array if the client does not have any health reports', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientId}/health-reports`)
        .expect(200)
        .expect([]);
    });

    it('should return all the health reports linked to the client', async () => {
      const newHealthReport1 = new HealthReport();
      newHealthReport1.clientId = clientId;
      newHealthReport1.year = 2024;
      newHealthReport1.guidance = 'positive';

      const newHealthReport2 = new HealthReport();
      newHealthReport2.clientId = clientId;
      newHealthReport2.year = 2025;
      newHealthReport2.guidance = 'negative';

      const healthReport1 = await healthReportRepo.save(newHealthReport1);
      const healthReport2 = await healthReportRepo.save(newHealthReport2);

      return request(app.getHttpServer())
        .get(`/clients/${clientId}/health-reports`)
        .expect(200)
        .expect([
          {
            year: healthReport1.year,
            clientId: clientId,
            guidance: healthReport1.guidance,
          },
          {
            year: healthReport2.year,
            clientId: clientId,
            guidance: healthReport2.guidance,
          },
        ]);
    });

    it('should return an error 404 Not Found if the client does not exist', () => {
      return request(app.getHttpServer())
        .get(`/clients/${missingClientId}/health-reports`)
        .expect(404);
    });
  });

  describe('POST /clients/:clientId/health-reports/:year', () => {
    it('should return the new health report of it was created successfully', () => {
      const year = 2025;
      const guidance = 'positive';

      return request(app.getHttpServer())
        .post(`/clients/${clientId}/health-reports/${year}`)
        .send({
          guidance,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toEqual({
            year,
            guidance,
            clientId,
            client: {
              id: clientId,
              firstName: clientFirstName,
              lastName: clientLastName,
            },
          });
        });
    });

    it('should return an error 403 Forbidden is a report already exists', async () => {
      const year = 2025;
      const guidance = 'positive';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .post(`/clients/${clientId}/health-reports/${year}`)
        .send({
          guidance,
        })
        .expect(403);
    });

    it('should return an error 400 Bad Request if the guidance is wrong', () => {
      const year = 2025;
      const guidance = 'wrong guidance';

      return request(app.getHttpServer())
        .post(`/clients/${clientId}/health-reports/${year}`)
        .send({
          guidance,
        })
        .expect(400);
    });
  });

  describe('PUT /clients/:clientId/health-reports/:year', () => {
    it('should return the new health report if it was update successfully', async () => {
      const year = 2025;
      const guidance = 'positive';
      const newGuidance = 'negative';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .put(`/clients/${clientId}/health-reports/${year}`)
        .send({
          guidance: newGuidance,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            year,
            guidance: newGuidance,
            clientId,
            client: {
              id: clientId,
              firstName: clientFirstName,
              lastName: clientLastName,
            },
          });
        });
    });

    it('should return an error 404 Not Found if the report does not exist', async () => {
      const year = 2025;
      const guidance = 'positive';
      const newGuidance = 'negative';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .put(`/clients/${missingClientId}/health-reports/${year}`)
        .send({
          guidance: newGuidance,
        })
        .expect(404);
    });

    it('should return an error 400 Bad Request if the guidance is wrong', async () => {
      const year = 2025;
      const guidance = 'positive';
      const newGuidance = 'wrong guidance';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .put(`/clients/${clientId}/health-reports/${year}`)
        .send({
          guidance: newGuidance,
        })
        .expect(400);
    });
  });

  describe('DELETE /clients/:clientId/health-reports/:year', () => {
    it('should return a status 204 No Content if the report was successfully deleted', async () => {
      const year = 2025;
      const guidance = 'positive';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .delete(`/clients/${clientId}/health-reports/${year}`)
        .expect(204);
    });

    it('should return an error 404 Not Found if the report does not exist', async () => {
      const year = 2025;
      const guidance = 'positive';

      const newHealthReport = new HealthReport();
      newHealthReport.clientId = clientId;
      newHealthReport.year = year;
      newHealthReport.guidance = guidance;
      await healthReportRepo.save(newHealthReport);

      return request(app.getHttpServer())
        .delete(`/clients/${missingClientId}/health-reports/${year}`)
        .expect(404);
    });
  });
});
