import { Guidance } from '../../health-reports/entities/health-report.entity';

export type HealthReportInfo = {
  year: number;
  guidance: Guidance;
};

export type Homonyms = {
  clientId: number;
  healthReports: HealthReportInfo[];
}[];

function areHealthReportsCompatible(
  healthReports1: HealthReportInfo[],
  healthReports2: HealthReportInfo[],
) {
  // Compare 2 arrays of health reports and returns true if there is at least 1
  // report with the same year in both, and all the reports with the same year
  // have the same guidance

  const healthReportsMap1: Map<string, Guidance> = new Map(
    healthReports1.map(
      ({ year, guidance }) => [year.toString(), guidance] as const,
    ),
  );
  const healthReportsMap2: Map<string, Guidance> = new Map(
    healthReports2.map(
      ({ year, guidance }) => [year.toString(), guidance] as const,
    ),
  );

  // All the years present in both arrays of reports
  const commonYears = [...healthReportsMap1.keys()].filter((year) =>
    healthReportsMap2.has(year),
  );

  // We can't know if the reports are compatible if they don't have any reports of the same year
  if (commonYears.length === 0) {
    return false;
  }

  // The 2 reports array are considered compatibles if there are no reports with same year and different guidance
  // (all reports of the same year have the same guidance)
  return commonYears.every(
    (year) => healthReportsMap1.get(year) === healthReportsMap2.get(year),
  );
}

export function getDuplicates(homonyms: Homonyms) {
  // Compare all the health reports of homonyms, and return an array
  // of an array of the clients id considered duplicates.
  // Examples:
  // - [ [1, 2] ] if client 1 and client 2 are duplicates
  // - [ [1, 2, 3] ] if client 1, client 2 and client 3 are duplicates
  // - [ [1, 2], [3, 4] ] if client 1 and client 2 are duplicates, and client 3 and 4 are also duplicates
  // - [ ] if no duplicates are found (every clients are considered distinct)

  if (homonyms.length < 2) {
    return [];
  }

  // We construct an array of duplicates, initializing it with the first client.
  // Then we compare the next client with it:
  // - if they are compatibles, we add the id of second next client, and add its health reports so we take into account all the reports of both
  // - if not, then we add a new distinct element of the array of duplicates, containing only this second client
  // We do the same for each potential duplicate: check if we can add it to the array of existing duplicates, and if not,
  // add a new distinct element.
  // For example, if we start with clients id 1, 2, 3, 4, we initialize the duplicates array with client 1:
  // [ { clientsIds: [1] } ]
  // Then we check client 2 against the duplicates. If it's not compatible, we add a new distinct element:
  // [ { clientsIds: [1] }, { clientsIds: [2] } ]
  // Same for client 3, but this time it's compatible with client 1:
  // [ { clientsIds: [1, 3] }, { clientsIds: [2] } ]
  // And client 4 is compatible with clients 1 AND 3:
  // [ { clientsIds: [1, 3, 4] }, { clientsIds: [2] } ]
  const distinctClients = homonyms.reduce(
    (
      duplicates: {
        clientIds: number[];
        healthReports: { year: number; guidance: Guidance }[];
      }[],
      _,
      currentIndex,
    ) => {
      if (currentIndex < homonyms.length - 1) {
        const foundDuplicate = duplicates.some((duplicate) => {
          if (
            areHealthReportsCompatible(
              homonyms[currentIndex + 1].healthReports,
              duplicate.healthReports,
            )
          ) {
            duplicate.clientIds.push(homonyms[currentIndex + 1].clientId);
            duplicate.healthReports = duplicate.healthReports.concat(
              homonyms[currentIndex + 1].healthReports,
            );
            return true;
          }
        });

        if (!foundDuplicate) {
          duplicates.push({
            clientIds: [homonyms[currentIndex + 1].clientId],
            healthReports: homonyms[currentIndex + 1].healthReports,
          });
        }
      }
      return duplicates;
    },
    [
      {
        clientIds: [homonyms[0].clientId],
        healthReports: homonyms[0].healthReports,
      },
    ],
  );

  // We return only the arrays of at least 2 clients, and only their ids
  return distinctClients
    .filter((distinctClients) => distinctClients.clientIds.length > 1)
    .map((distinctClients) => distinctClients.clientIds);
}
