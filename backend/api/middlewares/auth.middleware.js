import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  if (!authHeader) return res.status(401).json({ error: 'No autorizado, token faltante' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.log('Formato del header incorrecto');
    return res.status(401).json({ error: 'Formato del token incorrecto' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log('Scheme no es Bearer');
    return res.status(401).json({ error: 'Formato del token incorrecto' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.log('Error al verificar token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado, por favor inicie sesión de nuevo' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
}