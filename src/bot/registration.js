const { InlineKeyboard } = require("grammy");

exports.registration = async (ctx) => {
    try {
        const keyboard = new InlineKeyboard().webApp("Formani to'ldirish", "https://webapp-psi-tawny.vercel.app/")

        await ctx.reply("Qabulga yozilish uchun quyidagi formani to'ldiring:", {
            reply_markup: keyboard
        })
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}