const { InlineKeyboard } = require("grammy");

const keyboard = new InlineKeyboard().webApp(
    "Forma to‘ldirish",
    "https://webapp-gold-tau.vercel.app/"
  );

exports.Result = async (ctx) => {
    try {
        ctx.reply("Tahlil natijangizni yuklab olish uchun formani to‘ldiring! Forma to‘ldirish uchun quyidagi tugmani bosing.", {
            reply_markup: keyboard
        });
    } catch (error) {
        console.log(error);
        ctx.reply("❌ Serverda xatolik!");
    }
};
