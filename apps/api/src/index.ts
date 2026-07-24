/**
 * @portfolio/api — M0 stub.
 * The full middleware pipeline (helmet, CORS allow-list, rate limits,
 * zod validation, auth, audit) lands in M4/M5 per the project spec.
 * This stub exists so the workspace, CI, and Docker plumbing are real
 * from day one.
 */
import express from 'express';
import { pinoHttp } from 'pino-http';

const app = express();
app.disable('x-powered-by');
app.use(pinoHttp());

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'portfolio-api', version: '0.1.0' });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`api listening on :${port}`);
});
