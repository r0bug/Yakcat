// Single source of truth for JWT configuration
export const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'your-secret-key';

// Export this to ensure all files use the same secret
export function getJWTSecret(): string {
  return JWT_SECRET;
}