# Paladin technical test

This repo contains the code of Paladin's technical test. The instructions can be found on this
[Notion page](https://paladin-care.notion.site/Test-Technique-Node-js-Paladin-15a30552924a80ffbf46f45da18faf84).

1. [Project setup](#project-setup)
2. [Routes description](#routes)

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

### GET `/client/{clientId}`

Get a client by its id.

Success response:
```
{
    id: <clientId>,
    firstName: <firstName>,
    lastName: <lastName>
}
```

Error responses:
- 404: clientId not found


### GET `/client/{clientId}/health-reports`

Get all the health reports of a client by its id.

Success response:
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
- 404: clientId not found

### POST `/client`

Body:
```
{
    firstName: <firstName>,
    lastName: <lastName>
}
```

Create a new client with given first name and last name. They are both
mandatory and not empty strings.

Success response:
```
{
    id: <newClientId>,
    firstName: <firstName>,
    lastName: <lastName>
}
```

Error responses:
- 400: element(s) missing from body, empty, or not a string

### PUT `/client/{clientId}`

Replace the firstName and lastName of a client.

Body:
```
{
    firstName: <newFirstName>,
    lastName: <newLastName>
}
```

Success response:
```
{
    id: <clientId>,
    firstName: <newFirstName>,
    lastName: <newLastName>
}
```

Error responses:
- 404: clientId not found

### PATCH `/client/{clientId}`

Update a client partially with a new first name and/or last name.

Body example:
```
{
    firstName: <newFirstName>
}
```

Success response:
```
{
    id: <clientId>,
    firstName: <newFirstName>,
    lastName: <lastName>
}
```

Error responses:
- 404: clientId not found

### DELETE `/client/{clientId}`

Delete a client and all their associated health reports.

Error responses:
- 404: clientId not found

## Health reports

### GET `/health-report/client/{clientId}/year/{year}`

Get a health report by its clientId and year.

Success response:
```
{
    clientId: <clientId>,
    year: <year>,
    guidance: <guidance>
}
```

Error responses:
- 404: health report not found for clientId and year

### POST `/health-report/client/{clientId}/year/{year}`

Create new report for clientId and year.

Body:
```
{
    guidance: <guidance>
}
```

Success response:
```
{
    clientId: <clientId>,
    year: <year>,
    guidance: <guidance>
}
```

Error responses:
- 403: health report already exists for clientId and year
- 400: guidance is missing, empty, or not "positive" or "negative"

### PUT `/health-report/client/{clientId}/year/{year}`

Update a health report of a clientId and year.

Body:
```
{
    guidance: <guidance>
}
```

Error responses:
- 404: health report not found for clientId and year
- 400: guidance is missing, empty, or not "positive" or "negative"

### DELETE `/health-report/client/{clientId}/year/{year}`

Delete a health report for a clientId and year.

Error responses:
- 404: health report not found for clientId and year
