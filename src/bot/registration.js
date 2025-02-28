const { Keyboard } = require("grammy");
const { patientModel } = require("../models/patientModel");
const { uzMenyu } = require("./menyuKeyboard");

const uzContactKeyboard = new Keyboard()
    .requestContact("📞 Telefon raqamni yuborish")
    .resized()
    .oneTime();

const ruContactKeyboard = new Keyboard()
    .requestContact("📞 Отправить номер телефона")
    .resized()
    .oneTime();

const enContactKeyboard = new Keyboard()
    .requestContact("📞 Send Phone Number")
    .resized()
    .oneTime();



exports.askNextStep = async (ctx, user) => {
    if (user.step === 1) {
        if (user.language === "Language-Uzb") {
            await ctx.reply(`👤  <b>Familiya</b>, <b>Ism</b> va <b>Sharifingizni</b> kiriting!`, { parse_mode: "HTML" });
        } else if (user.language === "Language-Rus") {
            await ctx.reply(`👤 Введите свою <b>фамилию</b>, <b>имя</b> и <b>титул</b>!`, { parse_mode: "HTML" });
        } else if (user.language === "Language-Eng") {
            await ctx.reply(`👤 Enter your <b>Last Name</b>, <b>First Name</b> and <b>Your Title</b>!`, { parse_mode: "HTML" });
        }
    } else if (user.step === 2) {
        if (user.language === "Language-Uzb") {
            await ctx.reply(`🎂 Tu'gulgan <b>Kun</b>, <b>Oy</b> va <b>Yilingizni</b> kiriting 
<b>Masalan:</b>  25.05.2025`, { parse_mode: "HTML" });
        } else if (user.language === "Language-Rus") {
            await ctx.reply(`🎂 Введите <b>День</b>, <b>Месяц</b> и <b>Год</b> рождения
<b>Например:</b> 25.05.2025`, { parse_mode: "HTML" });
        } else if (user.language === "Language-Eng") {
            await ctx.reply(`🎂 Enter your <b>Day</b>, <b>Month</b> and <b>Year</b> of birth
<b>For example:</b> 25.05.2025`, { parse_mode: "HTML" });
        }
    } else if (user.step === 3) {
        if (user.language === "Language-Uzb") {
            await ctx.reply("📧 Emailingizni kiriting!");
        } else if (user.language === "Language-Rus") {
            await ctx.reply("📧 Введите свой адрес электронной почты!");
        } else if (user.language === "Language-Eng") {
            await ctx.reply("📧 Enter your email!");
        }
    } else if (user.step === 4) {
        if (user.language === "Language-Uzb") {
            await ctx.reply("📲 Telefon raqamingizni yuboring buning uchun pastdagi Telefon raqamni yuborish tugmasini bosing!", {
                reply_markup: uzContactKeyboard
            });
        } else if (user.language === "Language-Rus") {
            await ctx.reply("📲 Отправьте свой номер телефона, нажмите кнопку Отправить номер телефона ниже!", {
                reply_markup: ruContactKeyboard
            });
        } else if (user.language === "Language-Eng") {
            await ctx.reply("📲 Send your phone number, click the Send Phone Number button below!", {
                reply_markup: enContactKeyboard
            });
        }
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

        if (!user.step || user.step === 0) {
            user.step = 1
            await user.save()
            return this.askNextStep(ctx, user);
        }

    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}