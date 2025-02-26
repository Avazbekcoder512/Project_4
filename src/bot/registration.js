const { Keyboard } = require("grammy");
const { patientModel } = require("../models/patientModel");
const { uzMenyu } = require("./menyuKeyboard");

const contactKeyboard = new Keyboard()
  .requestContact("📞 Telefon raqamni yuborish")
  .resized()
  .oneTime();


exports.askNextStep = async (ctx, user) => {
    if (user.step === 1) {
        await ctx.reply(`👤  <b>Familiya</b>, <b>Ism</b> va <b>Sharifingizni</b> kiriting!`, { parse_mode: "HTML" });
    } else if (user.step === 2) {
        await ctx.reply(`🎂 Tu'gulgan <b>Kun</b>, <b>Oy</b> va <b>Yilingizni</b> kiriting 
<b>Masalan:</b>  25.05.2025`, { parse_mode: "HTML" });
    } else if (user.step === 3) {
        await ctx.reply("📧 Emailingizni kiriting!");
    } else if (user.step === 4) {
        await ctx.reply("📲 Telefon raqamingizni yuboring buning uchun pastdagi Telefon raqamni yuborish tugmasini bosing!", {
            reply_markup: contactKeyboard});
    } else if (user.step === 6) {
        await ctx.reply("✅ Ma'lumotlaringiz saqlandi!")
        uzMenyu(ctx)
    }
}

exports.registration = async (ctx) => {
    try {
        const userId = ctx.from.id

        let user = await patientModel.findOne({ chatId: userId })

        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (!user.step) {
            user.step = 1
            await user.save()
            return this.askNextStep(ctx, user);
        }

        
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}