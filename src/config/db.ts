import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "linkedinclone",
  user: "postgres",
  password: "0809iccs",
});
