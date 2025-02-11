const { Bot, session, } = require('grammy')
const { commands } = require('./commands')
const { Menyu } = require('./menyu')
const { Doctors, handleCallbackQuery } = require('./doctors')
const { Service } = require('./service')
const { priceCallbackQuery, Sections } = require('./price')
const { Result } = require('./result')
const { default: axios } = require('axios')
require('dotenv').config()

const bot = new Bot(process.env.BOT_TOKEN)

bot.api.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish!' },
    { command: 'info', description: "Bot nima qila olishi haqida ma'lumot!" },
    { command: 'ijtimoiy_tarmoqlar', description: 'Bizni ijtimoiy tarmoqlarda kuzatib boring!' }
])

commands(bot)

bot.use(session({ initial: () => ({}) }));

bot.on("message:text", async (ctx) => {
    if (ctx.session.waitingForOrder) {
        return await Result(ctx); // Order number yoki verification code kiritilsa, ushbu funksiya chaqiriladi
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
// bot.on("message:web_app_data", async (ctx) => {
//     try {
//         console.log(ctx.web_app_data);
        
//         const data = JSON.parse(ctx.message.web_app_data.data);
//         const { orderNumber, verificationCode } = data;  
        
//         console.log(data);
        

//         await ctx.reply("⏳ Ma’lumot tekshirilmoqda...");

//         const response = await axios.get(`https://project-4-c2ho.onrender.com/download-result`, {
//             params: { orderNumber, verificationCode },
//             responseType: "arraybuffer",
//         });

//         if (response.status === 200) {
//             await ctx.replyWithDocument(new InputFile(Buffer.from(response.data), "tahlil_natijasi.pdf"));
//         } else {
//             await ctx.reply("⚠️ Tahlil natijasi topilmadi!");
//         }
//     } catch (error) {
//         console.error(error);
//         await ctx.reply("❌ Xatolik yuz berdi, ma'lumotlar noto‘g‘ri bo‘lishi mumkin!");
//     }
// });



bot.on("callback_query:data", handleCallbackQuery, priceCallbackQuery);

exports.runBot = () => {
    try {
        bot.start();
        console.log('Bot ishga tushdi...');
    } catch (error) {
        console.log(error);
    }
}