// ✅ clean order
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../routes/authRoutes.js';
import productRouter from '../routes/productsRoutes.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(helmet());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api', router);
app.use('/api', productRouter);

app.listen(PORT, '0.0.0.0', () => console.log(`listening to ${PORT}`));
