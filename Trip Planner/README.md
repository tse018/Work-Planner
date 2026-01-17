# Trip Planner - Full Stack Application

A modern trip planning application built with React (frontend) and .NET (backend).

## Project Structure

```
trip-planner/
├── client/                 # React TypeScript frontend
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # ASP.NET Core backend
│   ├── Controllers/       # API endpoints
│   ├── Program.cs         # Application entry point
│   ├── TripPlanner.API.csproj  # Project file
│   └── Properties/        # Configuration files
└── README.md             # This file
```

## Prerequisites

- **Node.js** 18.0 or higher
- **.NET 8 SDK** or higher
- **npm** or **yarn** for frontend package management

## Frontend Setup

### Installation

```bash
cd client
npm install
```

### Development

```bash
cd client
npm run dev
```

The React app will be available at `http://localhost:5173`

### Build

```bash
cd client
npm run build
```

## Backend Setup

### Prerequisites

Ensure you have .NET 8 SDK installed. Check with:
```bash
dotnet --version
```

### Development

```bash
cd server
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:7100` (or the configured port)

Swagger UI will be available at `/swagger`

### Build

```bash
cd server
dotnet build
```

### Project File

The `TripPlanner.API.csproj` includes:
- ASP.NET Core Web API framework
- Entity Framework Core for database access
- Swagger/OpenAPI for API documentation
- CORS support for React frontend

## API Endpoints

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create a new trip

**Create Trip Request Body:**
```json
{
  "name": "Summer Vacation",
  "destination": "Hawaii",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15"
}
```

## Development Workflow

1. **Start the backend**:
   ```bash
   cd server
   dotnet run
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application** at `http://localhost:5173`

4. **View API documentation** at `http://localhost:5000/swagger`

## Environment Variables

### Frontend
- Currently uses default development settings
- Update `vite.config.ts` for API endpoints as needed

### Backend
- Development CORS is configured to allow requests from `http://localhost:5173`
- Modify `Program.cs` for production environment configuration

## Building for Production

### Frontend
```bash
cd client
npm run build
```

Build output will be in `client/dist/`

### Backend
```bash
cd server
dotnet publish -c Release
```

## Technologies Used

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

### Backend
- **.NET 8** - Framework
- **ASP.NET Core** - Web API
- **Entity Framework Core** - ORM
- **Swagger/OpenAPI** - API documentation

## Future Enhancements

- [ ] Database integration (SQL Server)
- [ ] User authentication
- [ ] Trip details and itinerary management
- [ ] Expense tracking
- [ ] Destination recommendations
- [ ] Real-time notifications
- [ ] Mobile app

## Contributing

Guidelines for contributing to this project will be added as the project evolves.

## License

TBD

## Support

For questions or issues, please create an issue in the project repository.
