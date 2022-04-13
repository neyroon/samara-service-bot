import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { DB } from "./db.js";
import { UserModel, ClientModel } from "./models.js";

dotenv.config();

const passWord = process.env.PASS_WORD;

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

    if ((msg.text === "/start") | (msg.text === "/auth")) {
      const user = await UserModel.findOne({ where: { chatId: `${chatId}` } });

      if (user) {
        return bot.sendMessage(chatId, `Не нужно писать ${msg.text} еще раз!`);
      }

      await UserModel.create({ chatId });

      return bot.sendMessage(
        chatId,
        `Введите кодовое слово для подписки на уведомления`
      );
    } else if (msg.text === passWord) {
      return bot.sendMessage(
        chatId,
        `Готово! Теперь вы получаете уведомления!`
      );
    }
  });
};

startBot();

const fastify = Fastify();

fastify.register(fastifyCors);

fastify.post("/callback", async (request, reply) => {
  try {
    const { phone, type, fault, city } = request.body;

    const client = await ClientModel.findOne({ where: { phone } });
    if (client) return reply.code(400).send();

    await ClientModel.create({ phone });

    const users = await UserModel.findAll();
    for (const user of users) {
      bot.sendMessage(
        user.chatId,
        `*Телефон:* \`${phone}\`\n${type ? `*Тип техники:* ${type}` : ""}\n${
          fault ? `*Неисправность:* ${fault}` : ""
        }\n${city ? `*Город:* ${city}` : ""}`,
        { parse_mode: "Markdown" }
      );
    }
  } catch (error) {}

  reply.code(200).send();
});

fastify.listen(3000, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
