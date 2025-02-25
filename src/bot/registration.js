const { Keyboard } = require("grammy");

exports.registration = async (ctx) => {
    try {
       ctx.reply(`<b>Familiya</b>, <b>Ism</b> va <b>Sharifingizni</b> kiriting!`, { parse_mode: "HTML"})       
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
}