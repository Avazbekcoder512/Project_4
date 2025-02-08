const { serviceModel } = require("../models/serviceModel");

exports.Service = async (ctx) => {
    try {
        const result = await serviceModel.find();

        if (!result.length) {
            return ctx.reply('🙅‍♂️  Xizmatlar topilmadi!');
        }

        let text = `<b>Xizmatlar ro'yxati</b>\n\n`;

        result.forEach((service, index) => {
            text += `🔹 <b>${index + 1}.</b> <b>${service.uz_name}</b> - ${service.uz_title}\n`;
        });

        await ctx.reply(text, { parse_mode: "HTML" });

    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!');
    }
};
