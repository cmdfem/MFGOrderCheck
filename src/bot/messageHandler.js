import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createUploadDirectory } from "../utils/fileProcessor.js";
import { generateFileListMessage } from "./utils/messageUtils.js";
import handleStartProcessing from "./handlers/commands/startProcessing.js";
import handleCancelProcessing from "./handlers/commands/cancelProcessing.js";
import { initializeState } from "./utils/stateManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (bot) => {
    const state = initializeState();

    bot.onText(/\/newOrderCheck/, async (msg) => {
        state.readyForFiles = true;
        state.filesToProcess = [];
        state.currentDir = createUploadDirectory(__dirname);
        state.statusMessage = await bot.sendMessage(msg.chat.id, "🔄 Готов делать сверку. Присылай файлы.");
    });

    bot.on("document", async (msg) => {
        const chatId = msg.chat.id;

        if (!state.readyForFiles) {
            return bot.sendMessage(chatId, "Я пока не готов принимать файлы. Напиши команду /newOrderCheck");
        }

        const fileId = msg.document.file_id;
        const fileName = msg.document.file_name;
        const filePath = path.join(state.currentDir, "upload", fileName);

        state.filesToProcess.push({ fileId, fileName, filePath });

        const fileListText = generateFileListMessage(state.filesToProcess);

        await bot.editMessageText(fileListText, { chat_id: chatId, message_id: state.statusMessage.message_id });
    });

    handleStartProcessing(bot, state);
    handleCancelProcessing(bot, state);
};
