const { Keyboard } = require("grammy");


exports.Result = async (ctx) => {
    try {
        ctx.reply("Tahlil natijangizni yuklab olish uchun formani to'ldiring! Forma to'ldirish uchun quyidagi tugmani bosing.", {
            reply_markup: new Keyboard()
            .text("📝 Forma").webApp("https://yourdomain.com")
            .resized()
        });
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}