import process from 'node:process'
import { DataSource } from 'typeorm'
// Required for TypeORM to work properly
import 'reflect-metadata' 
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a new DataSource instance for TypeORM
// This configuration will be used to connect to the PostgreSQL database
export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Automatically synchronize the database schema with the entities
    logging: false, // Disable logging for production
    entities: [path.join(__dirname, '/../entities/*.js')], // Path to your entity files
})

