const { InlineKeyboard } = require("grammy");
const { patientModel } = require("../models/patientModel");

const uzKeyboard = new InlineKeyboard().text("Ma'lumotlarni o'zgartirish", "refresh")
const ruKeyboard = new InlineKeyboard().text("Изменить данные", "refresh")
const enKeyboard = new InlineKeyboard().text("Change data", "refresh")

exports.uzProfile = async (ctx) => {
    try {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })

        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.email) {
            await ctx.reply(`
                Sizning ma'lumotlaringiz:\n\n
<b>🧑  Ism:</b> ${user.name}\n\n
<b>👤  Foydalanuvchi ismi:</b> @${user.username}\n\n
<b>🎂  Tug'ilgan kun:</b> ${user.date_of_birth}\n\n
<b>🌍  Viloyat:</b> ${user.region}\n\n
<b>🏙  Shahar yoki tuman:</b> ${user.district}\n\n
<b>🏡  Mahalla:</b> ${user.quarter}\n\n
<b>🏠  Uy manzili:</b> ${user.address}\n\n
<b>📧  Email:</b> ${user.email}\n\n
<b>📱  Telefon raqam:</b> ${user.phoneNumber}\n\n
<b>🩺  Tanlagan xizmatingiz:</b> ${user.service}`, {
                reply_markup: uzKeyboard,
                parse_mode: "HTML",
            })
        } else {
            await ctx.reply(`
            Sizning ma'lumotlaringiz:
<b>Ism:</b> ${user.name}
<b>Foydalanuvchi ismi:</b> @${user.username}\n\n
`, {
                parse_mode: "HTML"
            })
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}

exports.ruProfile = async (ctx) => {
    try {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })

        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.email) {
            await ctx.reply(`
                Ваша информация:\n\n
<b>🧑  Имя:</b> ${user.name}\n\n
<b>👤  Имя пользователя:</b> @${user.username}\n\n
<b>🎂  Дата рождения:</b> ${user.date_of_birth}\n\n
<b>🌍  Регион:</b> ${user.region}\n\n
<b>🏙  Город или район:</b> ${user.district}\n\n
<b>🏡  Район:</b> ${user.quarter}\n\n
<b>🏠  Домашний адрес:</b> ${user.address}\n\n
<b>📧  Электронная почта:</b> ${user.email}\n\n
<b>📱  Номер телефона:</b> ${user.phoneNumber}\n\n
<b>🩺  Выбранная вами услуга:</b> ${user.service}`, {
                reply_markup: ruKeyboard,
                parse_mode: "HTML",
            })
        } else {
            await ctx.reply(`
            Ваша информация:
<b>Имя:</b> ${user.name}
<b>Имя пользователя:</b> @${user.username}\n\n
`, {
                parse_mode: "HTML"
            })
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Ошибка сервера!');
    }
}

exports.enProfile = async (ctx) => {
    try {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })

        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.email) {
            await ctx.reply(`
               Your details:\n\n
<b>🧑  Name:</b> ${user.name}\n\n
<b>👤  Username:</b> @${user.username}\n\n
<b>🎂  Date of birth:</b> ${user.date_of_birth}\n\n
<b>🌍  Region:</b> ${user.region}\n\n
<b>🏙  City or district:</b> ${user.district}\n\n
<b>🏡  Neighborhood:</b> ${user.quarter}\n\n
<b>🏠  Home address:</b> ${user.address}\n\n
<b>📧  Email:</b> ${user.email}\n\n
<b>📱  Phone number:</b> ${user.phoneNumber}\n\n
<b>🩺  Your chosen service:</b> ${user.service}`, {
                reply_markup: enKeyboard,
                parse_mode: "HTML",
            })
        } else {
            await ctx.reply(`
            Your details:
<b>Name:</b> ${user.name}
<b>Username:</b> @${user.username}\n\n
`, {
                parse_mode: "HTML"
            })
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Server error!');
    }
}