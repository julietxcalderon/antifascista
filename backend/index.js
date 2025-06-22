import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './api/routes/products.routes.js';
import authRoutes from './api/routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));