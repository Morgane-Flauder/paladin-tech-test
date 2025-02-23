import { Guidance } from '../../health-reports/entities/health-report.entity';
import { getDuplicates } from './duplicates-utils';

describe('getDuplicates', () => {
  describe('No duplicates', () => {
    it('should return an empty list when there are no potential duplicates', () => {
      expect(getDuplicates([]).length).toBe(0);
    });
    it('should return an empty list when there is only one potential duplicates', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [{ year: 1, guidance: 'positive' as Guidance }],
        },
      ];
      expect(getDuplicates(potentialDuplicates).length).toBe(0);
    });
    it('should return an empty list when the potential duplicates have no reports from same year', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [{ year: 1, guidance: 'positive' as Guidance }],
        },
        {
          clientId: 2,
          healthReports: [{ year: 2, guidance: 'positive' as Guidance }],
        },
      ];
      expect(getDuplicates(potentialDuplicates).length).toBe(0);
    });
    it('should return an empty list when the potential duplicates have at least 1 report of same year but different guidance', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'negative' as Guidance },
          ],
        },
      ];
      expect(getDuplicates(potentialDuplicates).length).toBe(0);
    });
  });

  describe('All clients are duplicates', () => {
    it('should return a list of 1 element containing both clients id if 2 clients have the same reports', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual([1, 2]);
    });
    it('should return a list of 1 element containing all clients id if all clients have the same reports', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 3,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual([1, 2, 3]);
    });
    it('should return a list of 1 element containing all clients id if all clients have compatible reports, even if some years are missing', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [{ year: 1, guidance: 'positive' as Guidance }],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 3,
          healthReports: [{ year: 2, guidance: 'positive' as Guidance }],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual([1, 2, 3]);
    });
  });

  describe('Some duplicates but not all', () => {
    it('should return a list of 1 element containing clients id when compatible', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 3,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'negative' as Guidance },
          ],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual([1, 2]);
    });
    it('should return a list of 1 element containing clients id when compatible, grouped by the first compatible ones', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 4, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 3,
          healthReports: [
            { year: 2, guidance: 'positive' as Guidance },
            { year: 3, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 4,
          healthReports: [
            { year: 3, guidance: 'positive' as Guidance },
            { year: 4, guidance: 'negative' as Guidance },
          ],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual([1, 2, 3]);
    });
  });

  describe('Multiple groups of duplicates', () => {
    it('should return a list of 2 elements containing 2 clients id each when there are different groupes of duplicates', () => {
      const potentialDuplicates = [
        {
          clientId: 1,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 2,
          healthReports: [
            { year: 1, guidance: 'positive' as Guidance },
            { year: 2, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 3,
          healthReports: [
            { year: 3, guidance: 'positive' as Guidance },
            { year: 4, guidance: 'positive' as Guidance },
          ],
        },
        {
          clientId: 4,
          healthReports: [
            { year: 3, guidance: 'positive' as Guidance },
            { year: 4, guidance: 'positive' as Guidance },
          ],
        },
      ];
      const result = getDuplicates(potentialDuplicates);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual([1, 2]);
      expect(result[1]).toEqual([3, 4]);
    });
  });
});
