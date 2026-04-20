# Crime Database Management System - API Architecture

This document outlines the complete API architecture for the Crime Database Management System, which consists of two Next.js applications sharing a Supabase backend.

## Architecture Overview

```
                    INTERNET
                        │
        ┌─────────────────────────────────┐
        │           USERS                  │
        │                                 │
        │  Public Users        Police Officers
        │  (citizens)          (login)
        └─────────────┬───────────────┬───┘
                      │               │
        ┌─────────────▼───────┐ ┌─────▼────────────┐
        │     public-app      │ │    officer-app   │
        │                     │ │                  │
        │  FIR submission     │ │ Dashboard       │
        │  Case lookup        │ │ Case mgmt       │
        │  Search criminals   │ │ Investigation   │
        └─────────────┬───────┘ └─────┬───────────┘
                      │               │
                      └──────┬────────┘
                             │
                     API / Backend
                             │
                ┌────────────▼───────────┐
                │     Next.js API        │
                │                        │
                │ /api/auth              │
                │ /api/firs              │
                │ /api/person            │
                │ /api/case              │
                └────────────┬───────────┘
                             │
                     Database Layer
                             │
                 ┌───────────▼───────────┐
                 │       Supabase        │
                 │                       │
                 │ crimes table         │
                 │ accused table        │
                 │ officers table       │
                 │ fir table            │
                 └──────────────────────┘
```

## API Routes (officer-app)

All API routes are located in `officer-app/app/api/` and require authentication for write operations.

### Authentication (`/api/auth`)

#### POST `/api/auth/login`
- **Description**: Officer login with UID and password
- **Request Body**: `{ uid: string, password: string }`
- **Response**: `{ ok: true, officer: {...} }` with httpOnly cookie token
- **Status Codes**: 200 (success), 400 (missing credentials), 401 (invalid credentials), 500 (server error)

#### GET `/api/auth/me`
- **Description**: Get current authenticated officer
- **Headers**: Cookie with `token`
- **Response**: `{ officer: {...} }`
- **Status Codes**: 200 (success), 401 (not authenticated/invalid token), 404 (not found), 500 (server error)

#### POST `/api/auth/logout`
- **Description**: Logout current officer (clears cookie)
- **Response**: `{ ok: true }`
- **Status Codes**: 200 (success), 500 (server error)

### FIRs (`/api/firs`)

#### GET `/api/firs`
- **Description**: List all FIRs with optional filters
- **Query Parameters**:
  - `id` (optional): Filter by FIR ID
  - `crime_type` (optional): Filter by crime type ID
  - `status` (optional): Filter by status
  - `location` (optional): Filter by location (partial match)
  - `date_from` (optional): Filter by date from (ISO date)
  - `date_to` (optional): Filter by date to (ISO date)
- **Response**: `{ firs: FIRWithRelations[] }`
- **Status Codes**: 200 (success), 500 (server error)

#### POST `/api/firs`
- **Description**: Create a new FIR
- **Headers**: `x-officer-badge` (officer badge number for auth)
- **Request Body**: See FIR payload schema below
- **Response**: `{ ok: true, fir: FIRWithRelations }`
- **Status Codes**: 201 (created), 400 (validation failed), 500 (server error)

**FIR Payload Schema:**
```typescript
{
  complainant_name: string;          // Required
  guardian_name?: string | null;
  gender?: "Male" | "Female" | "Other";
  age?: number | null;
  dob?: string | null;
  address?: string | null;
  phone?: string | null;
  date_of_occurrence?: string | null;
  time_of_occurrence?: string | null;
  location: string;                   // Required
  crime_type_id: string;              // Required
  ipc_sections?: string | null;
  description: string;                // Required
  accused?: Array<{                   // Optional
    name?: string | null;
    address?: string | null;
    description?: string | null;
  }>;
  property_items?: Array<{            // Optional
    item_name: string;
    quantity?: number;
    estimated_value?: number;
  }>;
}
```

#### GET `/api/firs/[id]`
- **Description**: Get a specific FIR by ID
- **Response**: `{ fir: FIRWithRelations }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

#### PATCH `/api/firs/[id]`
- **Description**: Update a FIR (status, description, etc.)
- **Request Body**: Partial FIR fields
- **Response**: `{ ok: true, fir: FIRWithRelations }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### FIR Evidence (`/api/firs/[id]/evidence`)

#### GET `/api/firs/[id]/evidence`
- **Description**: Get all evidence for a FIR
- **Response**: `{ evidence: Evidence[] }`
- **Status Codes**: 200 (success), 500 (server error)

#### POST `/api/firs/[id]/evidence`
- **Description**: Upload evidence for a FIR
- **Request Body**: `{ url: string, type: string, description?: string }`
- **Response**: `{ ok: true, evidence: Evidence }`
- **Status Codes**: 201 (created), 400 (validation failed), 500 (server error)

#### DELETE `/api/firs/[id]/evidence/[evidenceId]`
- **Description**: Delete evidence
- **Response**: `{ ok: true }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### FIR Notes (`/api/firs/[id]/notes`)

#### GET `/api/firs/[id]/notes`
- **Description**: Get all case notes for a FIR
- **Response**: `{ notes: CaseNote[] }`
- **Status Codes**: 200 (success), 500 (server error)

#### POST `/api/firs/[id]/notes`
- **Description**: Add a case note
- **Request Body**: `{ note: string }`
- **Response**: `{ ok: true, note: CaseNote }`
- **Status Codes**: 201 (created), 400 (validation failed), 500 (server error)

### Persons (`/api/person`)

#### GET `/api/person?query=<search_term>`
- **Description**: Search for persons (criminals, accused, witnesses, etc.) by name or phone
- **Query Parameters**:
  - `query` (required): Search term (name or phone number)
- **Response**: `{ persons: Person[] }`
- **Status Codes**: 200 (success), 400 (missing query), 500 (server error)

#### GET `/api/person/[id]`
- **Description**: Get a specific person with their case involvements
- **Response**: `{ person: Person & { involvements: PersonInvolvement[] } }`
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### Notifications (`/api/notifications`)

#### GET `/api/notifications`
- **Description**: Get notifications for the authenticated officer
- **Headers**: Cookie with `token`
- **Query Parameters**:
  - `unread_only` (optional): Filter to unread notifications only
- **Response**: `{ notifications: Notification[] }`
- **Status Codes**: 200 (success), 401 (not authenticated), 500 (server error)

#### PATCH `/api/notifications`
- **Description**: Mark notifications as read
- **Headers**: Cookie with `token`
- **Request Body**: `{ notification_ids: string[] }`
- **Response**: `{ ok: true }`
- **Status Codes**: 200 (success), 401 (not authenticated), 500 (server error)

## Database Schema

### Core Tables

- **police_stations**: Police station information
- **officers**: Officer details with authentication (uid, password_hash, role)
- **crime_types**: Crime type definitions with IPC sections
- **firs**: First Information Reports
- **case_followups**: Case timeline/updates
- **news_articles**: Verified news articles linked to FIRs

### Extended Tables (from migrations)

- **accused**: Accused persons linked to FIRs
- **property_items**: Stolen/lost property items
- **case_notes**: Internal case notes (officers only)
- **evidence**: Evidence files (images, videos, documents)
- **notifications**: Officer notifications
- **audit_logs**: Audit trail for major actions

## Authentication Flow

1. Officer submits credentials to `/api/auth/login`
2. Server verifies password against `officers.password_hash`
3. Server generates JWT token with officer info
4. Token stored in httpOnly cookie (7-day expiry)
5. Subsequent requests include cookie automatically
6. `/api/auth/me` validates token and returns officer data

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read Access**: FIRs, stations, crime types (read-only)
- **Officer Write Access**: Officers can only modify their own cases/notes
- **Admin Access**: Full access for officers with `role = 'admin'`
- **JWT Tokens**: Signed with `JWT_SECRET` environment variable
- **Password Hashing**: bcrypt with salt rounds

## Future Enhancements

- `/api/case` route for case-specific operations (currently handled under `/api/firs/[id]`)
- Person database table (currently using mock data)
- Advanced search with filters (age, gender, involvement type)
- Bulk operations for FIR updates
- Export/import functionality
- Real-time notifications via WebSockets
