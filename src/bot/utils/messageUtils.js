// src/bot/utils/messageUtils.js
export const generateFileListMessage = (files) => {
    let fileListText = files.map((file, idx) => `${idx + 1}. ${file.fileName}`).join("\n");

    return `📥 Идет загрузка файлов:\n\n${fileListText}\n\nПосле загрузки всех файлов используй /startProcessing\nЧтобы отменить обработку используй /cancelProcessing`;
};

export const generateFilesStatusBlock = (systems, detectedSystems, files, filesLoaded = {}) => {
    return (
        "Обнаружены файлы по системам:\n\n" +
        systems
            .map((system) => {
                if (filesLoaded[system]) {
                    return `✅ ${system} – файл ${files.find((file) => file.fileName.toLowerCase().includes(system.toLowerCase())).fileName} загружен`;
                } else if (detectedSystems[system]) {
                    return `📥 ${system} – готов к загрузке файла ${files.find((file) => file.fileName.toLowerCase().includes(system.toLowerCase())).fileName}`;
                } else {
                    return `❌ ${system} – файл не обнаружен, пропущен`;
                }
            })
            .join("\n")
    );
};

export const generateProcessingStatusBlock = (processedSystems, currentProcessingSystem = null, recordsCount = {}) => {
    if (processedSystems.length === 0 && !currentProcessingSystem) {
        return "";
    }

    let processingBlock = "\n\nОбработка данных:\n\n";
    processingBlock += processedSystems.map((system) => `✅ ${system} – таблица создана (${recordsCount[system]} записей)`).join("\n");

    if (currentProcessingSystem) {
        processingBlock += `\n🕖 ${currentProcessingSystem} – обрабатываю файл...`;
    }

    return processingBlock;
};

export const generateFinalMessage = (filesStatusBlock, processingStatusBlock) => {
    return `${filesStatusBlock}${processingStatusBlock}\n\n✅ Обработка завершена!`;
};
