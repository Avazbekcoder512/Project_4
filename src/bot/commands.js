const { Keyboard, InlineKeyboard } = require("grammy")
const { userModel } = require("../models/usersModel")

const langKeyboard = new InlineKeyboard()
    .text("🇺🇿 O'zbek tili", "Language-Uzb")
    .text('🇷🇺 Rусский язык', "Language-Rus").row()
    .text('🇬🇧 English language', "Language-Eng")

exports.commands = async (bot) => {
//     bot.command('social_networks', async (ctx) => {
//         await ctx.reply(
//             `Telegram:      🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Havola</a>\n
// Instagram:      🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Havola</a>\n
// Bizning sayt:   🔗 <a href='https://hayatmed.uz/uz/'> Hayat Medical Center</a>`,
//             {
//                 parse_mode: 'HTML',
//                 // reply_markup: keyboard
//             })
//     })

//     bot.command('info', async (ctx) => {
//         await ctx.reply(
//             `Bu bot orqali <b>Hayat Med</b> klinikasi  👨‍⚕️<b>shifokorlari</b> haqida ma'lumot olishingiz,\n
// Xizmatlar bilan tanishishingiz va  🧬 tahlillarning narxlarini bilishingiz,\n
// <b>Eng muhimi</b> topshirgan tahlillaringizni javobini  📂<b>pdf fayl</b> shaklida yuklab olishingiz mumkin!`,
//             {
//                 parse_mode: 'HTML',
//                 // reply_markup: keyboard
//             })
//     })

    bot.command('lang', async (ctx) => {
        await ctx.reply(`
            Tilni tanlang!  /  Выберите язык!  /  Choose a language!`,
            {
                reply_markup: langKeyboard
            })
    })

    bot.command('start', async (ctx) => {
        const user = await userModel.findOne({ chatId: ctx.chat.id })
        if (!user) {
            const newUser = await userModel.create({
                chatId: ctx.chat.id,
                first_name: ctx.chat.first_name,
                last_name: ctx.chat.last_name,
                username: ctx.chat.username,
                language: ""
            })

            await ctx.reply(`
                Tilni tanlang!  /  Выберите язык!  /  Choose a language!`,
                {
                    reply_markup: langKeyboard
                })
        } else {
            if (user.language === "Language-Uzb") {
                await ctx.reply(`Botdan to'liq foydalanish uchun <b>📋 Menyu</b> tugmasini bosing!`, {
                    parse_mode: 'HTML',
                    reply_markup: new Keyboard().text("📋 Menyu").resized()
                })
            } else if (user.language === "Language-Rus") {
                await ctx.reply(`Чтобы в полной мере использовать возможности бота, нажмите кнопку <b>📋 Меню</b>!`, {
                    parse_mode: 'HTML',
                    reply_markup: new Keyboard().text("📋 Меню").resized()
                })
            } else if (user.language === "Language-Eng") {
                await ctx.reply(`To use the bot to its full potential, press the <b>📋 Menu</b> button!`, {
                    parse_mode: 'HTML',
                    reply_markup: new Keyboard().text("📋 Menu").resized()
                })
            }
        }
    })
}