const { Keyboard } = require("grammy");
const { patientModel } = require("../models/patientModel");

exports.uzMenyu = async (ctx) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })
    if (user.action === "Start") {
        const keyboard = new Keyboard()
            .text("🧑‍⚕️  Shifokorlar")
            .text("🩺  Xizmatlar").row()
            .text("💵  Tahlil narxlari")
            .text("🧬  Tahlil natijasi").row()
            .text("📝  Qabulga yozilish")
            .text("👤  Ma'lumotlarim")
            .resized()
            .oneTime()
        await ctx.reply('Kerakli menyuni tanlang', {
            reply_markup: keyboard
        })
    }
}

exports.ruMenyu = async (ctx) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })

    if (user.action === "Start") {
        const keyboard = new Keyboard()
            .text("🧑‍⚕️  Врачи")
            .text("🩺  Услуги").row()
            .text("💵  Анализ цен")
            .text("🧬  Результат анализа").row()
            .text("📝  Регистрация")
            .text("👤  Моя информация")
            .resized()
            .oneTime()
        await ctx.reply('Выберите желаемое меню', {
            reply_markup: keyboard
        })
    }
}

exports.enMenyu = async (ctx) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })

    if (user.action === "Start") {
        const keyboard = new Keyboard()
            .text("🧑‍⚕️  Doctors")
            .text("🩺  Services").row()
            .text("💵  Analysis prices")
            .text("🧬  Analysis result").row()
            .text("📝  Registration")
            .text("👤  My information")
            .resized()
            .oneTime()
        await ctx.reply('Select the desired menu', {
            reply_markup: keyboard
        })
    }
}