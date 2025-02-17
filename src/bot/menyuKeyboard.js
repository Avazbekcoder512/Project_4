const { Keyboard } = require("grammy")

exports.uzMenyu = async (ctx) => {
    const keyboard = new Keyboard()
    .text("🧑‍⚕️  Shifokorlar")
    .text("🩺  Xizmatlar").row()
    .text("💵  Tahlil narxlari")
    .text("🧬  Tahlil natijasi")
    .resized();
   await ctx.reply('Kerakli menyuni tanlang', {
    reply_markup: keyboard
   })
}

exports.ruMenyu = async (ctx) => {
    const keyboard = new Keyboard()
    .text("🧑‍⚕️  Врачи")
    .text("🩺  Услуги").row()
    .text("💵  Анализ цен")
    .text("🧬  Результат анализа")
    .resized();
   await ctx.reply('Выберите желаемое меню', {
    reply_markup: keyboard
   })
}

exports.enMenyu = async (ctx) => {
    const keyboard = new Keyboard()
    .text("🧑‍⚕️  Doctors")
    .text("🩺  Services").row()
    .text("💵  Analysis prices")
    .text("🧬  Analysis result")
    .resized();
   await ctx.reply('Select the desired menu', {
    reply_markup: keyboard
   })
}