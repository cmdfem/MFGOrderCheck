module.exports = {
    name: "1C",
    tableName: "onec_orders",
    columns: [
        { name: "business_unit", type: "TEXT" },
        { name: "site_order_id", type: "TEXT" },
        { name: "status", type: "TEXT" },
    ],
    parseFunction: (data) =>
        data.map((row) => ({
            business_unit: row["Бизнес единица"],
            site_order_id: row["Номер на сайте"],
            status: row["Статус"],
        })),
};
