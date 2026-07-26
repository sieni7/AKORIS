import { createProgram } from './program.js';

export async function bootstrap() {
  const program = createProgram();
  await program.parseAsync(process.argv);
}
