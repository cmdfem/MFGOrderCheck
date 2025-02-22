import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import csv from "csv-parser";

import fetch from "node-fetch";
import { pipeline } from "stream/promises";

export const downloadFile = async (bot, file) => {
    const fileLink = await bot.getFileLink(file.fileId);
    const response = await fetch(fileLink);
    await pipeline(response.body, fs.createWriteStream(file.filePath));
};
export const createUploadDirectory = (baseDir) => {
    const date = new Date();
    const dateStr = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    let dirName = path.join(baseDir, "../../data", dateStr);
    let index = 1;

    while (fs.existsSync(dirName)) {
        index++;
        dirName = path.join(baseDir, "../../data", `${dateStr}-${index}`);
    }

    fs.mkdirSync(dirName, { recursive: true });
    fs.mkdirSync(path.join(dirName, "upload"));

    return dirName;
};

// Добавленные функции для парсинга Excel
export const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
};

// Добавленные функции для парсинга CSV
export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};
