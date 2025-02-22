const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const messageHandler = require("./messageHandler");

const bot = new TelegramBot(TOKEN, { polling: true });

// Подключаем обработчики сообщений
messageHandler(bot);

console.log("🤖 Бот успешно запущен!");
