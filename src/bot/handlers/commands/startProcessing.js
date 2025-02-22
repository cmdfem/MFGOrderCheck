// src/bot/handlers/commands/startProcessing.js

import { downloadFile } from "../../../utils/fileProcessor.js";
import { createDatabase } from "../../../database/db.js";
import { processOmsFile } from "../../../processors/oms.js";
import { processOneCFile } from "../../../processors/onec.js";
import { generateFilesStatusBlock, generateProcessingStatusBlock, generateFinalMessage } from "../../utils/messageUtils.js";

export default (bot, state) => {
    bot.onText(/\/startProcessing/, async (msg) => {
        const chatId = msg.chat.id;

        if (state.filesToProcess.length === 0) {
            return bot.sendMessage(chatId, "⚠️ Нет файлов для обработки.");
        }

        const systems = ["oms", "1c", "СДЭК", "Почта РФ", "5posts", "DPD"];
        const detectedSystems = systems.reduce((acc, system) => {
            acc[system] = state.filesToProcess.some((file) => file.fileName.toLowerCase().includes(system.toLowerCase()));
            return acc;
        }, {});

        let filesLoaded = {};
        let filesStatusBlock = generateFilesStatusBlock(systems, detectedSystems, state.filesToProcess);
        let processingMessage = await bot.sendMessage(chatId, filesStatusBlock);

        // Загрузка файлов
        for (const system of systems) {
            if (!detectedSystems[system]) continue;

            const file = state.filesToProcess.find((file) => file.fileName.toLowerCase().includes(system.toLowerCase()));
            if (!file) continue;

            await downloadFile(bot, file);
            filesLoaded[system] = true;

            filesStatusBlock = generateFilesStatusBlock(systems, detectedSystems, state.filesToProcess, filesLoaded);
            await bot.editMessageText(filesStatusBlock, { chat_id: chatId, message_id: processingMessage.message_id });
        }

        // Создание базы данных
        const db = createDatabase(
            state.currentDir,
            Object.keys(detectedSystems).filter((s) => detectedSystems[s])
        );

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
        });

        // Обработка файлов и создание таблиц
        let processedSystems = [];
        let recordsCount = {};
        for (const system of systems) {
            if (!detectedSystems[system]) continue;

            const file = state.filesToProcess.find((file) => file.fileName.toLowerCase().includes(system.toLowerCase()));
            if (!file) continue;

            let processingStatusBlock = generateProcessingStatusBlock(processedSystems, system, recordsCount);
            await bot.editMessageText(filesStatusBlock + processingStatusBlock, { chat_id: chatId, message_id: processingMessage.message_id });

            const count = await new Promise((resolve) => {
                if (system === "oms") {
                    processOmsFile(db, file.filePath, resolve);
                } else if (system === "1c") {
                    processOneCFile(db, file.filePath, resolve);
                } else {
                    resolve(0);
                }
            });
            processedSystems.push(system);
            recordsCount[system] = count;

            processingStatusBlock = generateProcessingStatusBlock(processedSystems, null, recordsCount);
            await bot.editMessageText(filesStatusBlock + processingStatusBlock, { chat_id: chatId, message_id: processingMessage.message_id });
        }

        db.serialize(() => {
            db.run("COMMIT");
            db.close();
        });

        const finalMessage = generateFinalMessage(filesStatusBlock, generateProcessingStatusBlock(processedSystems, null, recordsCount));
        await bot.editMessageText(finalMessage, { chat_id: chatId, message_id: processingMessage.message_id });
    });
};
