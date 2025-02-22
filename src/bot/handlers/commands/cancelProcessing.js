export default (bot) => async (msg) => {
    const chatId = msg.chat.id;
    const context = bot.context;

    if (!context?.readyForFiles) {
        return bot.sendMessage(chatId, "⚠️ Нет активной обработки для отмены.");
    }

    context.readyForFiles = false;
    context.filesToProcess = [];
    context.currentDir = "";

    await bot.sendMessage(chatId, "❌ Обработка файлов отменена.");

    if (context.statusMessage) {
        await bot.editMessageText("❌ Обработка файлов была отменена.", {
            chat_id: chatId,
            message_id: context.statusMessage.message_id,
        });
    }
};
