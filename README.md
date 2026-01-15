# M3 API Center

A metadata-driven API development tool that allows you to define your API structure once and generate TypeScript types, server stubs, and client API functions automatically.

## Features

- **Browser-based Metadata Editor**: Visual editor built with Vite + Preact + TypeScript
- **Type Definitions**: Define data types including:
  - Primitives (string, number, boolean)
  - Enums (constrained values)
  - Type aliases (named primitive types)
  - Objects with fields
  - Arrays
- **HTTP Interface Definitions**: Define APIs with:
  - HTTP methods (GET, POST, PUT, DELETE, PATCH)
  - URL parameters
  - Request body types
  - Response types
  - Custom headers
  - Server-Sent Events (SSE) support
- **Code Generator**: Automatically generates:
  - TypeScript type declarations
  - Server-side API stubs (Express-based)
  - Client-side fetch functions

## Getting Started

### Installation

```bash
npm install
```

### Run the Metadata Editor

```bash
npm run dev
```

This will start the development server. Open your browser to edit the metadata visually.

### Generate Code

After editing your metadata, you can generate TypeScript code:

```bash
npm run generate
```

This will:
1. Read the metadata from `data/metadata.json`
2. Generate files in the `generated/` directory:
   - `types.ts` - TypeScript type declarations
   - `server.ts` - Server-side API stubs
   - `client.ts` - Client-side API functions

## Project Structure

```
m3-api-center/
├── data/
│   └── metadata.json          # API metadata (can be edited in browser or manually)
├── src/
│   ├── components/            # Preact components for the editor
│   ├── types/                 # Metadata schema types
│   ├── app.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── style.css              # Application styles
├── generator/
│   └── index.ts               # Code generator script
├── generated/                 # Generated code output (created after running generate)
│   ├── types.ts
│   ├── server.ts
│   └── client.ts
└── index.html                 # HTML entry point

```

## Usage

### 1. Define Your API Metadata

Use the browser-based editor to:
- Create data types (enums, aliases, objects)
- Define HTTP interfaces (endpoints, methods, request/response types)

Or edit `data/metadata.json` directly.

### 2. Generate Code

Run `npm run generate` to create TypeScript files.

### 3. Use Generated Code

**Types** (`generated/types.ts`):
```typescript
import { User, UserRole } from './generated/types';
```

**Server** (`generated/server.ts`):
```typescript
import express from 'express';
import { setupRoutes } from './generated/server';

const app = express();
setupRoutes(app);
app.listen(3000);
```

**Client** (`generated/client.ts`):
```typescript
import { getUser, createUser } from './generated/client';

const user = await getUser(123);
const newUser = await createUser({ name: 'John', email: 'john@example.com', role: 'user' });
```

## Example Metadata

See `data/metadata.json` for an example metadata file that includes:
- User role enum
- Company name type alias
- User object type
- HTTP interfaces for CRUD operations

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate code from metadata

## License

ISC