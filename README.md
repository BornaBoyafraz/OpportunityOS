# OpportunityOS

OpportunityOS is a full-stack application that helps students organize opportunities, deadlines, and applications in one place.

## Problem It Solves

Students often track scholarships, internships, programs, grants, and school opportunities across spreadsheets, notes apps, email inboxes, and calendars. OpportunityOS is designed to bring those moving parts into one organized workspace so students can manage opportunities, application progress, deadlines, and notes with less friction.

## Current Project Status

This repository currently contains the initial Spring Boot backend setup. The backend is configured for PostgreSQL and uses environment variables for sensitive database configuration. React is planned for the frontend.

## Planned MVP Features

- User registration and login
- Add opportunities
- Edit and delete opportunities
- Track application status
- Deadlines
- Search and filtering
- Notes per application
- Dashboard statistics
- Responsive design

## Technology Stack

- Java
- Spring Boot
- PostgreSQL
- Maven
- React planned for the frontend

## Local Setup

1. Install Java 26 or the Java version configured in `pom.xml`.
2. Install PostgreSQL and create a database for OpportunityOS.
3. Configure the required environment variables.
4. Run the backend with the Maven wrapper.

## Required Environment Variables

Set these variables before running the application:

```bash
export DB_URL="jdbc:postgresql://localhost:5432/opportunityos"
export DB_USERNAME="your_database_username"
export DB_PASSWORD="your_database_password"
```

The same placeholders are shown in `src/main/resources/application.properties.example`.

## Run the Spring Boot Backend

From the project root:

```bash
./mvnw spring-boot:run
```

To run tests:

```bash
./mvnw test
```

## Project Roadmap

- Build the core opportunity and application data model
- Add authentication and user accounts
- Implement opportunity CRUD endpoints
- Add application status tracking and deadline support
- Create dashboard statistics
- Build the planned React frontend
- Add search, filters, and responsive UI polish

## Security

Secrets are not committed to this repository. Database credentials, API keys, tokens, private keys, and local environment files should be provided through environment variables or untracked local configuration files.

## Author

Seyedborna Boyafraz (Borna Afraz)

GitHub: https://github.com/BornaBoyafraz
