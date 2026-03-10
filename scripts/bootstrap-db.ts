import { execSync } from 'node:child_process';

const run = (command: string) => {
  execSync(command, { stdio: 'inherit' });
};

run('npx prisma migrate deploy');
run('npx prisma db seed');
