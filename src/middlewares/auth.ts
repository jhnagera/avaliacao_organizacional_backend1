import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  tipo: string;
  empresa_id: string;
  departamento_id?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.tipo !== 'admin' && req.user?.tipo !== 'super_admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  return next();
};

export const isRHorAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.tipo !== 'admin' && req.user?.tipo !== 'rh' && req.user?.tipo !== 'super_admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas RH ou administradores.' });
  }
  return next();
};
