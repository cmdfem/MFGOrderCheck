import { format } from "date-fns";

// Конвертация даты из формата Excel в JS Date
function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    const minutes = Math.floor(total_seconds / 60) % 60;
    const hours = Math.floor(total_seconds / 3600);

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

// Форматирование даты и времени
function formatDate(excelDate) {
    const jsDate = excelDateToJSDate(excelDate);
    return format(jsDate, "yyyy-MM-dd HH:mm:ss");
}

export { formatDate };
