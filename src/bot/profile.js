const { patientModel } = require("../models/patientModel");

exports.uzProfile = async (ctx) => {
    try {
        const user = await patientModel.findOne({ chatId: ctx.chat.id })

        if (!user) {
            await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
        }

        if (user.email) {
            await ctx.reply(`
                Sizning ma'lumotlaringiz:\n\n
<b>Ismingiz:</b> ${user.name}\n\n
<b>Foydalanuvchi ismi:</b> @${user.username}\n\n
<b>Tug'ilgan kuningiz:</b> ${user.date_of_birth}\n\n
<b>Viloyatingiz:</b> ${user.region}\n\n
<b>Shahar yoki tumaningiz:</b> ${user.district}\n\n
<b>Mahallangiz:</b> ${user.district}\n\n
<b>Ko'changiz:</b> ${user.street}\n\n
<b>Uy raqamingiz:</b> ${user.house}\n\n
<b>Emailingiz:</b> ${user.email}\n\n
<b>Telefon raqamingiz:</b> ${user.phoneNumber}\n\n
<b>Tanlagan xizmatingiz:</b> ${user.service}`, {
                parse_mode: "HTML"
            })
        } else {
            await ctx.reply(`
            Sizning ma'lumotlaringiz:
<b>Ismingiz:</b> ${user.name}
<b>Foydalanuvchi ismi:</b> @${user.username}\n\n
`, {
                parse_mode: "HTML"
            })
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}