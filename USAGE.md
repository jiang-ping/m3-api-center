# Usage Example

This example demonstrates the complete workflow of using M3 API Center.

## 1. Start the Metadata Editor

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 2. Define Your Data Types

### Add an Enum
1. Click "Add Enum"
2. Name it "UserRole"
3. Add values: "admin", "user", "guest"

### Add a Type Alias
1. Click "Add Alias"
2. Name it "UserId"
3. Select base type: "number"

### Add an Object
1. Click "Add Object"
2. Name it "User"
3. Add fields:
   - id: UserId
   - name: string
   - email: string
   - role: UserRole

## 3. Define HTTP Interfaces

Click "HTTP Interfaces" tab, then "Add Interface":

### Get User by ID
- Name: getUserById
- Method: GET
- Path: /api/users/:id
- URL Parameters: id (number)
- Response Type: User

### Create User
- Name: createUser
- Method: POST
- Path: /api/users
- Body Type: User
- Response Type: User
- Headers: Content-Type

## 4. Save Your Metadata

Click "Download JSON" to save your metadata.json file to `data/metadata.json`.

## 5. Generate Code

```bash
npm run generate
```

This creates three files in `generated/`:
- `types.ts` - TypeScript type definitions
- `server.ts` - Express server API stubs
- `client.ts` - Client-side fetch functions

## 6. Use Generated Code

### Server Side (Node.js + Express)

```typescript
import express from 'express';
import { setupRoutes } from './generated/server';

const app = express();
app.use(express.json());

// Setup generated routes
setupRoutes(app);

// Now implement your route handlers by editing generated/server.ts
// Replace the TODO comments with actual implementation

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Client Side

```typescript
import { getUserById, createUser } from './generated/client';
import type { User } from './generated/types';

// Fetch a user
const user = await getUserById(123);
console.log(user.name, user.role);

// Create a new user
const newUser: User = {
  id: 0,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user'
};
const created = await createUser(newUser);
```

## Benefits

1. **Single Source of Truth**: Define your API once, use everywhere
2. **Type Safety**: Full TypeScript types generated automatically
3. **Consistency**: Server and client always match
4. **Documentation**: The metadata serves as API documentation
5. **Rapid Development**: Generate boilerplate instantly

## Tips

- Use the JSON View tab to see/edit the raw metadata
- Save to LocalStorage to preserve work during development
- Keep metadata.json in version control
- Regenerate code whenever metadata changes
- The generated code is meant to be edited - add your business logic
