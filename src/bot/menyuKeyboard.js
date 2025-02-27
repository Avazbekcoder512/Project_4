const { Keyboard } = require("grammy")

exports.uzMenyu = async (ctx) => {
    const keyboard = new Keyboard()
    .text("🧑‍⚕️  Shifokorlar")
    .text("🩺  Xizmatlar").row()
    .text("💵  Tahlil narxlari")
    .text("🧬  Tahlil natijasi").row()
    .text("📝  Qabulga yozilish")
    .text("👤  Ma'lumotlarim")
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
    .text("🧬  Результат анализа").row()
    .text("📝  Регистрация")
    .text("👤  Моя информация")
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
    .text("🧬  Analysis result").row()
    .text("📝  Registration")
    .text("👤  My information")
    .resized();
   await ctx.reply('Select the desired menu', {
    reply_markup: keyboard
   })
}