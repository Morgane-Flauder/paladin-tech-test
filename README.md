# Paladin technical test

This repo contains the code of Paladin's technical test. The instructions can be found on this
[Notion page](https://paladin-care.notion.site/Test-Technique-Node-js-Paladin-15a30552924a80ffbf46f45da18faf84).

1. [Project setup](#project-setup)
2. [Routes description](#routes)
3. [Improvements](#improvements)

# Project setup

## Prerequisites

You should have:
- Node.js (version >= 20)
- Docker

## Installation

Clone the project and go to the project directory:
```bash
git clone https://github.com/Morgane-Flauder/paladin-tech-test.git
cd paladin-tech-test
```

Copy the environment variables:
```bash
cp .env.example .env
```

Run and initialize the local DB with Docker:
```bash
docker-compose up -d
```

Install the project dependencies:
```bash
npm install
```

## Run the project

Run the server:
```bash
npm run start:dev
```

To run the script to find duplicates clients, run:
```bash
npm run script src/scripts/find-duplicate-clients.script.ts
```

The script should display an array of arrays of 2 clientIds or more considered duplicates.

## Run tests

Unit tests for duplicates functions:
```bash
npm run test
```

Integration tests of the health reports routes:
```bash
npm run test:e2e
```

# Routes

## Clients

### GET `/clients/{clientId}`

Get a client by its id.

Success response: 200 OK
```
{
    id: <clientId>,
    firstName: <firstName>,
    lastName: <lastName>
}
```

Error responses:
- 404 Not Found: clientId not found

### POST `/clients`

Create a new client with given first name and last name. They are both
mandatory and not empty strings.

Body:
```
{
    firstName: <firstName>,
    lastName: <lastName>
}
```

Success response: 201 Created
```
{
    id: <newClientId>,
    firstName: <firstName>,
    lastName: <lastName>
}
```

Error responses:
- 400 Bad Request: element(s) missing from body, empty, or not a string

### PUT `/clients/{clientId}`

Replace the firstName and lastName of a client.

Body:
```
{
    firstName: <newFirstName>,
    lastName: <newLastName>
}
```

Success response: 200 OK
```
{
    id: <clientId>,
    firstName: <newFirstName>,
    lastName: <newLastName>
}
```

Error responses:
- 404 Not Found: clientId not found

### PATCH `/clients/{clientId}`

Update a client partially with a new first name and/or last name.

Body example:
```
{
    firstName: <newFirstName>
}
```

Success response: 200 OK
```
{
    id: <clientId>,
    firstName: <newFirstName>,
    lastName: <lastName>
}
```

Error responses:
- 404 Not Found: clientId not found

### DELETE `/clients/{clientId}`

Delete a client and all their associated health reports.

Success response: 204 No Content

Error responses:
- 404 Not Found: clientId not found

## Health reports

### GET `/clients/{clientId}/health-reports`

Get all the health reports of a client by its id.

Success response: 200 OK
```
[
    {
        clientId: <clientId>,
        year: <year1>,
        guidance: <guidance>
    },
    {
        clientId: <clientId>,
        year: <year2>,
        guidance: <guidance>
    }
]
```

If the client has no reports, the response is an empty list.

Error responses:
- 404 Not Found: clientId not found


### POST `/clients/{clientId}/health-reports/{year}`

Create new report for clientId and year.

Body:
```
{
    guidance: <guidance>
}
```

Success response: 201 Created
```
{
    year: <year>,
    guidance: <guidance>
    clientId: <clientId>,
    client: {
        id: <clientId>,
        firstName: <firstName>,
        lastName: <lastName>,
    },
}
```

Error responses:
- 403 Forbidden: health report already exists for clientId and year
- 400 Bad Request: guidance is missing, empty, or not "positive" or "negative"

### PUT `/clients/{clientId}/health-reports/{year}`

Update a health report of a clientId and year.

Body:
```
{
    guidance: <guidance>
}
```

Success responses: 200 OK
```
{
    year: <year>,
    guidance: <guidance>
    clientId: <clientId>,
    client: {
        id: <clientId>,
        firstName: <firstName>,
        lastName: <lastName>,
    },
}
```

Error responses:
- 404 Not Found: health report not found for clientId and year
- 400 Bad Request: guidance is missing, empty, or not "positive" or "negative"

### DELETE `/clients/{clientId}/health-reports/{year}`

Delete a health report for a clientId and year.

Success response: 204 No Content

Error responses:
- 404 Not Found: health report not found for clientId and year


# Improvements

- Refactor to throw HTTP exceptions in controllers only and not services
- Add a method to delete multiple health reports in HealthReportsService and inject it in ClientsService instead of the health report repository
- Refactor the script to find duplicates and the associated functions to make them more readable
- Add integration tests for the clients endpoints
- Return all the valid duplicates possibilities instead of choosing one by default when different configurations are possible 
