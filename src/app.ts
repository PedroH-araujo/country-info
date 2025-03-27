import express from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use('/api', routes);

export default app;
