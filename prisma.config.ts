// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });

import { defineConfig, env } from "prisma/config";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env first
dotenv.config({ path: path.resolve(__dirname, './.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

