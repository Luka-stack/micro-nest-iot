export type UserPayload = {
  email: string;
  displayName: string;
  role: string;
};

export type JwtPayload = UserPayload & {
  iat: number;
  exp: number;
};
