const { Bot } = require('grammy')
const { commands } = require('./commands')
const { Menyu } = require('./menyu')
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
            Menyu(ctx)
            break;
        case '🧑‍⚕️Shifokorlar':

            break;
        case '🛠Xizmatlar':

            break;
        case '🧪Tahlilar':

            break;
        case '📰Yangiliklar':

            break;
        case '🧬Tahlil natijasi':

            break;
        default:
            await ctx.reply(
                "Men gapingizga tushunmadim! 😕\n" +
                "Iltimos, botga murojaat qilganda pastdagi menyulardan foydalaning!"
            );
            break;
    }
})



exports.runBot = () => {
    bot.start()
        .then(console.log('Bot ishga tushdi...'))
        .catch(error => console.log(error))
}