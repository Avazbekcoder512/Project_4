// const { Bot, } = require('grammy')
// const { commands } = require('./commands')
// const { Menyu } = require('./menyu')
// const { Doctors, handleCallbackQuery } = require('./doctors')
// const { Service } = require('./service')
// const { priceCallbackQuery, Sections } = require('./price')
// require('dotenv').config()

// const bot = new Bot(process.env.BOT_TOKEN)

// bot.api.setMyCommands([
//     { command: 'start', description: 'Botni ishga tushirish!' },
//     { command: 'info', description: "Bot nima qila olishi haqida ma'lumot!" },
//     { command: 'ijtimoiy_tarmoqlar', description: 'Bizni ijtimoiy tarmoqlarda kuzatib boring!' }
// ])

// commands(bot)


// bot.on('message', async (ctx) => {
//     const text = ctx.msg.text
//     switch (text) {
//         case '📋 Menyu':
//             await Menyu(ctx)
//             break;
//         case '🧑‍⚕️  Shifokorlar':
//             await Doctors(ctx);
//             break;
//         case '🩺  Xizmatlar':
//             await Service(ctx)
//             break;
//         case '💵  Tahlil narxlari':
//             await Sections(ctx)
//             break;
//         case '🧬  Tahlil natijasi':

//             break;
//         default:
//             await ctx.reply(
//                 "Iltimos, botga murojaat qilganda pastdagi menyulardan foydalaning!"
//             );
//             break;
//     }
// })

// bot.on("callback_query:data", handleCallbackQuery, priceCallbackQuery);

// exports.runBot = () => {
//     try {
//         bot.start();
//         console.log('Bot ishga tushdi...');
//     } catch (error) {
//         console.log(error);
//     }
// }