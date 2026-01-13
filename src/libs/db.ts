import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema.js';
import localConfig from './config.js';

// Create postgres client
const client = postgres(localConfig.dbUrl, {
  prepare: false,
  max: 1,
  idle_timeout: 1,
  connect_timeout: 10
});

// Create drizzle instance
export const db = drizzle(client, { schema });