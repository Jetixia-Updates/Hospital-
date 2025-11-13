# Hospital Management System

A full-stack hospital management system built with React, Express, Prisma, and PostgreSQL.

## Features

- **Role-Based Access Control**: 8 different user roles (Admin, Manager, Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Patient)
- **Comprehensive Dashboards**: Customized dashboards for each role
- **Patient Management**: Complete patient records and medical history
- **Appointment Scheduling**: Book and manage appointments
- **Department Management**: Organize hospital departments
- **Clinic Management**: Manage different clinics and specializations
- **Equipment Tracking**: Monitor medical equipment and maintenance
- **Lab Tests**: Order and track laboratory tests
- **Medical Records**: Maintain detailed patient medical records
- **Prescription Management**: Create and track prescriptions

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router 6
- TailwindCSS 3
- Radix UI Components
- Recharts for data visualization

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt password hashing
- Zod validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jetixia-Updates/Hospital-.git
cd Hospital-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Seed the database (optional):
```bash
npm run db:seed
```

This will create test users for all roles:
- admin@example.com / Admin@123456
- manager@example.com / Manager@123456
- doctor@example.com / Doctor@123456
- nurse@example.com / Nurse@123456
- receptionist@example.com / Receptionist@123456
- labtech@example.com / LabTech@123456
- pharmacist@example.com / Pharmacist@123456
- patient@example.com / Patient@123456

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: production

5. Run migrations on production:
```bash
npm run db:migrate:prod
```

## Project Structure

```
├── client/                 # React frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utility functions
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── lib/              # Server utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seeding
├── shared/               # Shared types between client and server
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users` - Get all users (Admin/Manager)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user (Admin/Manager/Receptionist)
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Departments
- `GET /api/v1/departments` - Get all departments
- `GET /api/v1/departments/:id` - Get department by ID
- `POST /api/v1/departments` - Create department
- `PATCH /api/v1/departments/:id` - Update department
- `DELETE /api/v1/departments/:id` - Delete department

### Appointments
- `GET /api/v1/appointments` - Get all appointments
- `GET /api/v1/appointments/:id` - Get appointment by ID
- `POST /api/v1/appointments` - Create appointment
- `PATCH /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

### Clinics
- `GET /api/v1/clinics` - Get all clinics
- `POST /api/v1/clinics` - Create clinic
- `PATCH /api/v1/clinics/:id` - Update clinic

### Equipment
- `GET /api/v1/equipment` - Get all equipment
- `POST /api/v1/equipment` - Add equipment
- `PATCH /api/v1/equipment/:id` - Update equipment

### Lab Tests
- `GET /api/v1/lab-tests` - Get all lab tests
- `POST /api/v1/lab-tests` - Create lab test order
- `PATCH /api/v1/lab-tests/:id` - Update lab test

### Medical Records
- `GET /api/v1/medical-records` - Get all medical records
- `POST /api/v1/medical-records` - Create medical record
- `PATCH /api/v1/medical-records/:id` - Update medical record

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:prod` - Run migrations in production
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Prisma Studio

## License

MIT
