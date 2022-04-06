import Fastify from "fastify";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.BOT_API, { polling: true });
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Введите логин:");
});

const fastify = Fastify();

fastify.post("/callback", function (request, reply) {
  console.log(request.body);
  reply.statusCode = 200;
});

fastify.listen(3000, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
