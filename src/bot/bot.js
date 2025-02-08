const { Bot, InlineKeyboard } = require('grammy')
const { commands } = require('./commands')
const { Menyu } = require('./menyu')
const { Doctors, handleCallbackQuery } = require('./doctors')
const { doctorModel } = require('../models/doctorModel')
const { Service } = require('./service')
const { newsCallbackQuery, News } = require('./news')
require('dotenv').config()

const bot = new Bot(process.env.BOT_TOKEN)

bot.api.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish!' },
    { command: 'info', description: "Bot nima qila olishi haqida ma'lumot!" },
    { command: 'ijtimoiy_tarmoqlar', description: 'Bizni ijtimoiy tarmoqlarda kuzatib boring!' }
])

commands(bot)


bot.on('message:text', async (ctx) => {
    const text = ctx.msg.text
    switch (text) {
        case '📋 Menyu':
            await Menyu(ctx)
            break;
        case '🧑‍⚕️  Shifokorlar':
            await Doctors(ctx);
            break;
        case '🩺  Xizmatlar':
            await Service(ctx)
            break;
        case '🧪  Tahlilar':

            break;
        case '📰  Yangiliklar':
            await News(ctx)
            break;
        case '🧬  Tahlil natijasi':

            break;
        default:
            await ctx.reply(
                "Men gapingizga tushunmadim! 😕\n" +
                "Iltimos, botga murojaat qilganda pastdagi menyulardan foydalaning!"
            );
            break;
    }
})

bot.on("callback_query:data", handleCallbackQuery, newsCallbackQuery);

exports.runBot = () => {
    try {
        bot.start();
        console.log('Bot ishga tushdi...');
    } catch (error) {
        console.log(error);
    }
}