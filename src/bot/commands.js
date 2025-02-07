const { Keyboard } = require("grammy")

exports.commands = async (bot) => {
    bot.command('ijtimoiy_tarmoqlar', async (ctx) => {
        await ctx.reply(
            `Telegram:      🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Havola</a>\n
Instagram:      🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Havola</a>`,
            { parse_mode: 'HTML' })
    })

    bot.command('info', async (ctx) => {
        await ctx.reply(
            `Bu bot orqali <b>Hayat Med</b> klinikasi  👨‍⚕️<b>shifokorlari</b> haqida ma'lumot olishingiz,\n
<b>Hayat Med</b> klinikasidagi  📰<b>yangiliklardan</b> xabardor bo'lishingiz,\n
Xizmatlar bilan tanishishingiz va  🧪tahlillarning narxlarini bilishingiz,\n
<b>Eng muhimi</b> topshirgan tahlillaringizni javobini  📂<b>pdf fayl</b> shaklida yuklab olishingiz mumkin!`,
            { parse_mode: 'HTML' })
    })

    bot.command('start', async (ctx) => {
        const keyboard = new Keyboard()
            .text("📋 Menyu")
            .resized()

        if (!ctx.chat.first_name) {
            await ctx.reply(
                `Assalomu alaykum <b>${ctx.chat.username}</b> botimizga xush kelibsiz!\n
Botdan to'liq foydalanish uchun <b>Menyu</b> tugmasini bosing!`,
                {
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                }
            )
        } else {
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