export interface JwtPayload {
  sub: string;
  telefono: string;
  role: string;
  isSuperAdmin: boolean;
}