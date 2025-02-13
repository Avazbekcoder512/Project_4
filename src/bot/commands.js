const { Keyboard } = require("grammy")
const { userModel } = require("../models/usersModel")

const keyboard = new Keyboard()
    .text("📋 Menyu")
    .resized()

exports.commands = async (bot) => {
    bot.command('ijtimoiy_tarmoqlar', async (ctx) => {
        await ctx.reply(
            `Telegram:      🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Havola</a>\n
Instagram:      🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Havola</a>\n
Bizning sayt:   🔗 <a href='https://hayatmed.uz/uz/'> Hayat Medical Center</a>`,
            {
                parse_mode: 'HTML',
                reply_markup: keyboard
            })
    })

    bot.command('info', async (ctx) => {
        await ctx.reply(
            `Bu bot orqali <b>Hayat Med</b> klinikasi  👨‍⚕️<b>shifokorlari</b> haqida ma'lumot olishingiz,\n
Xizmatlar bilan tanishishingiz va  🧬 tahlillarning narxlarini bilishingiz,\n
<b>Eng muhimi</b> topshirgan tahlillaringizni javobini  📂<b>pdf fayl</b> shaklida yuklab olishingiz mumkin!`,
            {
                parse_mode: 'HTML',
                reply_markup: keyboard
            })
    })

    bot.command('start', async (ctx) => {
        if (ctx.chat.first_name == undefined) {
            const user = await userModel.findOne({username: ctx.chat.username})

            if (user) {
                 console.log('User bor!');
            }

            const newUser = await userModel.create({
                first_name: ctx.chat.first_name,
                last_name: ctx.chat.last_name,
                username: ctx.chat.username
            })
            
            await ctx.reply(
                `Assalomu alaykum <b>${ctx.chat.username}</b> botimizga xush kelibsiz!\n
Botdan to'liq foydalanish uchun <b>Menyu</b> tugmasini bosing!`,
                {
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                }
            )
        } else {            
            const user = await userModel.findOne({username: ctx.chat.username})

            if (user) {
                return console.log('User bor!');
            }

            const newUser = await userModel.create({
                first_name: ctx.chat.first_name,
                last_name: ctx.chat.last_name,
                username: ctx.chat.username
            })
            await ctx.reply(
                `Assalomu alaykum <b>${ctx.chat.first_name}</b> botimizga xush kelibsiz!\n
Botdan to'liq foydalanish uchun <b>Menyu</b> tugmasini bosing!`,
                {
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                }
            )
        }
    })
}