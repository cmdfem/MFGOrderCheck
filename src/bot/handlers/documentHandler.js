import path from "path";

export default (bot) => async (msg) => {
    const chatId = msg.chat.id;
    const context = bot.context;

    if (!context?.readyForFiles) {
        return bot.sendMessage(chatId, "Я пока не готов принимать файлы. Напиши команду /newOrderCheck");
    }

    const fileId = msg.document.file_id;
    const fileName = msg.document.file_name;
    const filePath = path.join(context.currentDir, "upload", fileName);

    context.filesToProcess.push({ fileId, fileName, filePath });

    let fileListText = context.filesToProcess.map((file, idx) => `${idx + 1}. ${file.fileName}`).join("\n");

    await bot.editMessageText(`📥 Идет загрузка файлов:\n\n${fileListText}\n\nПосле загрузки всех файлов используй /startProcessing\nЧтобы отменить обработку используй /cancelProcessing`, { chat_id: chatId, message_id: context.statusMessage.message_id });
};
