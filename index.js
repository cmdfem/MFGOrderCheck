import TelegramBot from "node-telegram-bot-api";
import { token } from "./src/bot/config.js";
import setupMessageHandlers from "./src/bot/messageHandler.js";

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

// Подключение обработчиков сообщений
setupMessageHandlers(bot);

// Сообщение о запуске
console.log("🤖 Бот успешно запущен!");
