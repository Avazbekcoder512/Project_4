const { Keyboard } = require("grammy")

exports.Menyu = async (ctx) => {
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