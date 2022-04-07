import Fastify from "fastify";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { DB } from "./db.js";
import { UserModel } from "./models.js";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_API, { polling: true });

const startBot = async () => {
  try {
    await DB.authenticate();
    await DB.sync();
  } catch (e) {
    console.log("Подключение к бд сломалось", e);
  }

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    try {
        const user = await UserModel.findOne({ chatId });
        if (user) {
          return bot.sendMessage(chatId, `Не нужно писать /start еще раз!`);
        }
        await UserModel.create({ chatId });
        return bot.sendMessage(chatId, `Скоро сюда будут поступать заявки!`);
      }
  });
};

startBot();

const fastify = Fastify();

fastify.post("/callback", async (request, reply) => {
  try {
    const users = await UserModel.findAll();
    for (const user of users) {
      bot.sendMessage(user.chatId, JSON.stringify(request.body));
    }
  } catch (error) {}
  reply.code(200).send("");
});

fastify.listen(3000, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
