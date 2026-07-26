import { buildApp } from './index.js';

const start = async () => {
  const app = await buildApp();
  const port = parseInt(process.env.PORT ?? '3000', 10);

  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📖 Swagger UI: http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
