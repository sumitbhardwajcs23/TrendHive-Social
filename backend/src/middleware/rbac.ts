import { Request, Response, NextFunction } from 'express';

export const Roles = {
  ADMIN: 'ADMIN',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  CREATOR: 'CREATOR',
  COPYWRITER: 'COPYWRITER',
  LEGAL_REVIEWER: 'LEGAL_REVIEWER',
  CLIENT_STAKEHOLDER: 'CLIENT_STAKEHOLDER',
  COMMUNITY_MANAGER: 'COMMUNITY_MANAGER',
  FREELANCER: 'FREELANCER'
} as const;

type Role = keyof typeof Roles;

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: User not found in request' });
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
