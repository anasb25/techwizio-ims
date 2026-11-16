import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = Number(process.env.PORT ?? 3001);

  try {
    await app.listen(port);
    console.log(`Techwizio IMS API running on http://localhost:${port}/api`);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Try: PORT=${port + 1} npm run start:dev`,
      );
    }
    throw error;
  }
}
await bootstrap();
