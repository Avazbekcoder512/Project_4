const { Keyboard, InlineKeyboard } = require("grammy")
const { patientModel } = require("../models/patientModel")
const data = require('../../regions.json')

const langKeyboard = new InlineKeyboard()
    .text("🇺🇿 O'zbek tili", "Language-Uzb")
    .text('🇷🇺 Rусский язык', "Language-Rus").row()
    .text('🇬🇧 English language', "Language-Eng")

exports.commands = async (bot) => {
    bot.command('social_networks', async (ctx) => {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })
        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.language === "Language-Uzb") {
            await ctx.reply(
                `Telegram:      🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Havola</a>\n
Instagram:      🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Havola</a>\n
Bizning sayt:   🔗 <a href='https://hayatmed.uz/uz/'> Hayat Medical Center</a>`,
                {
                    parse_mode: 'HTML',
                })
        } else if (user.language === "Language-Rus") {
            await ctx.reply(
                `Telegram: 🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Ссылка</a>\n
Instagram: 🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Ссылка</a>\n
Наш сайт: 🔗 <a href='https://hayatmed.uz/uz/'> Медицинский центр Хаят</a>`,
                {
                    parse_mode: 'HTML',
                })
        } else if (user.language === "Language-Eng") {
            await ctx.reply(
                `Telegram: 🔗 <a href='https://t.me/HAYAT_Medical_Centre'>Link</a>\n
Instagram: 🔗 <a href='https://www.instagram.com/hayatmedcentre/'>Link</a>\n
Our site: 🔗 <a href='https://hayatmed.uz/uz/'> Hayat Medical Center</a>`,
                {
                    parse_mode: 'HTML',
                })
        }
    })

    bot.command('info', async (ctx) => {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })
        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.language === "Language-Uzb") {
            await ctx.reply(
                `Bu bot orqali <b>Hayat Med</b> klinikasi  👨‍⚕️<b>shifokorlari</b> haqida ma'lumot olishingiz,\n
Xizmatlar bilan tanishishingiz va  🧬 tahlillarning narxlarini bilishingiz,\n
<b>Eng muhimi</b> topshirgan tahlillaringizni javobini  📂<b>pdf fayl</b> shaklida yuklab olishingiz mumkin!`,
                {
                    parse_mode: 'HTML',
                })
        } else if (user.language === "Language-Rus") {
            await ctx.reply(
                `С помощью этого бота вы можете получить информацию о врачах клиники <b>Hayat Med</b> 👨‍⚕️,\n
Ознакомьтесь с услугами и 🧬 ценами на анализы,\n
<b>Самое главное</b>, вы можете загрузить ответы на отправленные вами анализы в виде 📂<b>pdf-файла</b>!`,
                {
                    parse_mode: 'HTML',
                })
        } else if (user.language === "Language-Eng") {
            await ctx.reply(
                `With this bot, you can get information about the <b>Hayat Med</b> clinic 👨‍⚕️<b>doctors</b>,\n
Get acquainted with the services and 🧬 know the prices of the tests,\n
<b>Most importantly</b> you can download the results of your tests in the form of a 📂<b>pdf file</b>!`,
                {
                    parse_mode: 'HTML',
                })
        }
    })

    bot.command('lang', async (ctx) => {
        await ctx.reply(`
            Tilni tanlang!  /  Выберите язык!  /  Choose a language!`,
            {
                reply_markup: langKeyboard
            })
    })

    bot.command('start', async (ctx) => {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })
        if (!user) {
            const newUser = await patientModel.create({
                chatId: ctx.chat.id,
                name: ctx.chat.first_name,
                username: ctx.chat.username,
                role: "user"
            })

            await ctx.reply(`
                Tilni tanlang!  /  Выберите язык!  /  Choose a language!`,
                {
                    reply_markup: langKeyboard
                })
        } else {
            if (!user.language) {
                await ctx.reply(`
                    Tilni tanlang!  /  Выберите язык!  /  Choose a language!`,
                    {
                        reply_markup: langKeyboard
                    })
            }
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