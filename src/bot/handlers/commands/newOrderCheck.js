import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (bot) => async (msg) => {
    const chatId = msg.chat.id;

    // Логика команды /newOrderCheck
    // (сокращённый пример)
    const date = new Date();
    const dateStr = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    let dirName = path.join(__dirname, "../../../data", dateStr);
    let index = 1;

    while (fs.existsSync(dirName)) {
        index++;
        dirName = path.join(__dirname, "../../../data", `${dateStr}-${index}`);
    }

    fs.mkdirSync(dirName, { recursive: true });
    fs.mkdirSync(path.join(dirName, "upload"));

    bot.context = {
        readyForFiles: true,
        currentDir: dirName,
        filesToProcess: [],
        statusMessage: await bot.sendMessage(chatId, "🔄 Готов делать сверку. Присылай файлы."),
    };
};
