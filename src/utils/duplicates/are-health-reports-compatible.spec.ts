import { Guidance } from '../../health-reports/entities/health-report.entity';
import { areHealthReportsCompatible } from './duplicates-utils';

describe('areHealthReportsCompatible', () => {
  describe('Compatible health reports', () => {
    it('should return true if there are exactly the same reports', () => {
      const healthReports1 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
      ];
      const healthReports2 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
      ];
      expect(areHealthReportsCompatible(healthReports1, healthReports2)).toBe(
        true,
      );
    });
    it('should return true if all the reports with the same year have the same guidance, and some years are not in common', () => {
      const healthReports1 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
        {
          year: 2,
          guidance: 'positive' as Guidance,
        },
      ];
      const healthReports2 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
        {
          year: 3,
          guidance: 'positive' as Guidance,
        },
      ];
      expect(areHealthReportsCompatible(healthReports1, healthReports2)).toBe(
        true,
      );
    });
  });

  describe('Incompatible health reports', () => {
    it('should return false if there are no health reports', () => {
      expect(areHealthReportsCompatible([], [])).toBe(false);
    });
    it('should return false if there are no year in common', () => {
      const healthReports1 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
      ];
      const healthReports2 = [
        {
          year: 2,
          guidance: 'positive' as Guidance,
        },
      ];
      expect(areHealthReportsCompatible(healthReports1, healthReports2)).toBe(
        false,
      );
    });
    it('should return false if the health reports have the same year but a different guidance', () => {
      const healthReports1 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
      ];
      const healthReports2 = [
        {
          year: 1,
          guidance: 'negative' as Guidance,
        },
      ];
      expect(areHealthReportsCompatible(healthReports1, healthReports2)).toBe(
        false,
      );
    });
    it('should return false if some reports have the same year and guidance, but at least 1 have the same year and a different guidance', () => {
      const healthReports1 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
        {
          year: 2,
          guidance: 'positive' as Guidance,
        },
      ];
      const healthReports2 = [
        {
          year: 1,
          guidance: 'positive' as Guidance,
        },
        {
          year: 2,
          guidance: 'negative' as Guidance,
        },
      ];
      expect(areHealthReportsCompatible(healthReports1, healthReports2)).toBe(
        false,
      );
    });
  });
});
