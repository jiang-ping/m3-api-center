// Auto-generated client API
import { UserRole, CompanyName, User, CreateUserRequest } from './types';

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

export async function listUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}

export async function createUser(body: CreateUserRequest): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function streamEvents(): Promise<string> {
  const response = await fetch('/api/events');
  // SSE handling - return response for streaming
  return response as any;
}

