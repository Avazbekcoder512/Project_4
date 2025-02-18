const { serviceModel } = require("../../models/serviceModel");

exports.ruService = async (ctx) => {
    try {
        const result = await serviceModel.find();

        if (!result.length) {
            return ctx.reply('🙅‍♂️  Услуги не найдены!');
        }

        let text = `<b>Список услуг</b>\n\n`;

        result.forEach((service, index) => {
            text += `🔹 <b>${index + 1}.</b> <b>${service.ru_name}</b> - ${service.ru_title}\n`;
        });

        await ctx.reply(text, { 
            parse_mode: "HTML" 
        });
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Ошибка сервера!');
    }
};