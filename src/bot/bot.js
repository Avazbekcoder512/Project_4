const { Bot, session } = require('grammy');
const { commands } = require('./commands');
const { Menyu } = require('./menyu');
const { Doctors, handleCallbackQuery } = require('./doctors');
const { Service } = require('./service');
const { priceCallbackQuery, Sections } = require('./price');
const { Result } = require('./result');
require('dotenv').config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));

bot.api.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish!' },
    { command: 'info', description: "Bot nima qila olishi haqida ma'lumot!" },
    { command: 'ijtimoiy_tarmoqlar', description: 'Bizni ijtimoiy tarmoqlarda kuzatib boring!' }
]);

commands(bot);

bot.on("message:text", async (ctx) => {
    ctx.session = ctx.session ?? {};

    if (ctx.session.waitingForOrder) {
        return await Result(ctx);
    }

    const text = ctx.message.text;

    switch (text) {
        case "📋 Menyu":
            await Menyu(ctx);
            break;
        case "🧑‍⚕️  Shifokorlar":
            await Doctors(ctx);
            break;
        case "🩺  Xizmatlar":
            await Service(ctx);
            break;
        case "💵  Tahlil narxlari":
            await Sections(ctx);
            break;
        case "🧬  Tahlil natijasi":
            await Result(ctx);
            break;
        default:
            await ctx.reply("📌 Iltimos, menyudagi tugmalardan foydalaning.");
            break;
    }
});

bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data.startsWith("section_") || ctx.callbackQuery.data.startsWith("sheet_") || ctx.callbackQuery.data.startsWith("back_to_sections_")) {
        await priceCallbackQuery(ctx);
    } else {
        await handleCallbackQuery(ctx);
    }
});

exports.runBot = () => {
    bot.start();
    console.log('Bot ishga tushdi...');
};
