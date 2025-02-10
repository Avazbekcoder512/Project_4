const { InlineKeyboard } = require("grammy");

exports.Result = async (ctx) => {
    try {
        ctx.reply("Tahlil natijangizni yuklab olish uchun formani to‘ldiring! Forma to‘ldirish uchun quyidagi tugmani bosing.", {
            reply_markup: new InlineKeyboard()
                .url("📝 Forma", "https://web-app-orpin-phi.vercel.app/")
        });
    } catch (error) {
        console.log(error);
        ctx.reply("❌ Serverda xatolik!");
    }
};
