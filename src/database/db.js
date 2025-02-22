const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

class BaseProcessor {
    constructor(config) {
        this.config = config;
        this.dbPromise = this.initializeDB();
    }

    async initializeDB() {
        const db = await open({
            filename: "./database.sqlite",
            driver: sqlite3.Database,
        });

        // Создаём таблицу ТОЛЬКО если запускается обработка
        await db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.config.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${this.config.columns.map((col) => `${col.name} ${col.type}`).join(",\n")}
      )
    `);

        return db;
    }

    async process(data) {
        try {
            const parsedData = this.config.parseFunction(data);
            await this.saveToDB(parsedData);
            console.log(`${this.config.name}: Обработка завершена.`);
        } catch (error) {
            console.error(`${this.config.name}: Ошибка обработки`, error);
        }
    }

    async saveToDB(parsedData) {
        const db = await this.dbPromise;
        const columns = this.config.columns.map((col) => col.name).join(", ");
        const placeholders = this.config.columns.map(() => "?").join(", ");

        const stmt = await db.prepare(`
      INSERT INTO ${this.config.tableName} (${columns})
      VALUES (${placeholders})
    `);

        try {
            for (const row of parsedData) {
                const values = this.config.columns.map((col) => row[col.name]);
                await stmt.run(values);
            }
        } finally {
            await stmt.finalize();
        }
    }
}

module.exports = BaseProcessor;
