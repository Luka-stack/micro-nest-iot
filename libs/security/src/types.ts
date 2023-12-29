export const USER_ROLES = {
  ADMIN: 'administrator',
  MAINTAINER: 'maintainer',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserPayload = {
  email: string;
  displayName: string;
  role: UserRole;
};

export type JwtPayload = UserPayload & {
  iat: number;
  exp: number;
};
