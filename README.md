# OpportunityOS

OpportunityOS is a full-stack application that helps students organize opportunities, deadlines, and applications in one place.

## Problem It Solves

Students often track scholarships, internships, programs, grants, and school opportunities across spreadsheets, notes apps, email inboxes, and calendars. OpportunityOS is designed to bring those moving parts into one organized workspace so students can manage opportunities, application progress, deadlines, and notes with less friction.

## Current Project Status

This repository contains a Spring Boot/PostgreSQL backend and a React + Vite
frontend. The MVP supports user registration, login, private per-user
opportunity tracking, and create/edit/delete workflows.

## Current MVP Features

- User registration and login
- Add opportunities
- Edit and delete opportunities
- Track application status
- Deadlines
- Dashboard statistics
- Responsive design

## Technology Stack

- Java
- Spring Boot
- PostgreSQL
- Maven
- React
- Vite

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

## Run the React Frontend

Keep the backend running, then open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`). The frontend
expects the API at `http://localhost:8080`. See
[`frontend/README.md`](frontend/README.md) for configuration and production
build instructions.

## Project Roadmap

- Add search and filtering
- Add notes per application
- Add automated frontend tests
- Continue accessibility and responsive UI polish

## Security

Secrets are not committed to this repository. Database credentials, API keys, tokens, private keys, and local environment files should be provided through environment variables or untracked local configuration files.

## Author

Seyedborna Boyafraz (Borna Afraz)

GitHub: https://github.com/BornaBoyafraz
