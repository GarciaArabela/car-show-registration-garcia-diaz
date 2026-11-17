# AutoVista Events — Car Show 2027 Registration System

A modern, production-grade registration and payment tracking system built for the AutoVista Events "Car Show 2027" at Sorsogon City Coliseum.

---

## Team Members & Roles

| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **Arabela Garcia** | Backend Developer | .NET 10 Vertical Slice Architecture, Minimal APIs, EF Core, SQLite, FluentValidation, Scalar |
| **Diaz** | Frontend Developer | React JS (Vite), Tailwind CSS / Bootstrap, Dashboard & Registration UI |

---

## Repository Structure

```text
car-show-registration/
├── backend/                  # .NET 10 C# Vertical Slice Solution
│   ├── Api/                  # Minimal API endpoints, endpoint filters, Scalar OpenAPI
│   ├── Application/          # Feature slices (CQRS Commands, Queries, Handlers, FluentValidation)
│   ├── Domain/               # Registration entity, enums, Result pattern, zero dependencies
│   ├── Infrastructure/       # EF Core SQLite DbContext, migrations, database seeder
│   └── VerticalSlice.slnx    # Solution file
├── frontend/                 # React JS client application (Vite)
├── docs/
│   └── screenshots/          # Solution screenshots & test execution captures
├── .gitignore                # Excludes bin/, obj/, .vs/, node_modules/, dist/, *.db
└── README.md                 # Project documentation & team roles
```

---

## Backend Tech Stack

- **Framework**: .NET 10 (C# 14)
- **Architecture**: Vertical Slice Architecture + Clean Architecture principles
- **API Style**: ASP.NET Core Minimal APIs with Route Groups & Endpoint Filters
- **Database / ORM**: Entity Framework Core 10 with SQLite (`carshow.db`)
- **Validation**: FluentValidation 11
- **CQRS**: In-process lightweight CQRS interfaces (`ICommand<T>`, `IQuery<T>`)
- **Documentation**: Scalar OpenAPI Reference (`/scalar/v1`)
- **Design Patterns**: Domain Result pattern (`Result<T>`), RFC 7807 ProblemDetails error mapping

---

## Getting Started (Backend)

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- EF Core CLI Tools (`dotnet tool install --global dotnet-ef` or installed globally)

### Build & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Restore dependencies and build solution:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Run the API:
   ```bash
   dotnet run --project Api
   ```
4. Access interactive API documentation via Scalar:
   - **Scalar UI**: `http://localhost:5205/scalar/v1`
   - **Root endpoint**: `http://localhost:5205/`
