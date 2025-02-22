export default (db) => {
    const createTable = () => {
        db.run(`CREATE TABLE IF NOT EXISTS onec (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_unit TEXT,
            site_order_id TEXT,
            status TEXT
        )`);
    };

    const insertData = (dataArray, callback) => {
        const stmt = db.prepare(`INSERT INTO onec (
            business_unit, site_order_id, status
        ) VALUES (?, ?, ?)`);

        let remaining = dataArray.length;
        dataArray.forEach((row) => {
            stmt.run([row.business_unit, row.site_order_id, row.status], (err) => {
                if (err) console.error("Ошибка вставки в 1C:", err.message);
                remaining--;
                if (remaining === 0) {
                    stmt.finalize();
                    if (callback) callback();
                }
            });
        });
    };

    return { createTable, insertData };
};
