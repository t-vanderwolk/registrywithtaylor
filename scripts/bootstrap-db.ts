import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';

const run = (command: string) => {
  execSync(command, { stdio: 'inherit' });
};

const hasMigrationFiles = () => {
  if (!existsSync('prisma/migrations')) {
    return false;
  }

  return readdirSync('prisma/migrations').some((entry) => entry !== 'migration_lock.toml');
};

run('npx prisma migrate deploy');

if (!hasMigrationFiles()) {
  run('npx prisma migrate dev --name init');
}

run('npx prisma db seed');
