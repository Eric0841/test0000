/**
 * [ README ]
 * 본 코드는 개발자 Lda2#2968 에 의해 쓰여진 코드입니다.
 * 본 코드는 돈을 받고 판매되고 있는 코드입니다.
 * 따라서 무단 복제 및 배포는 절대 금지됩니다.
 * 발각 시 법적으로 대응할 예정입니다.
 */

const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs')

module.exports = {
    name: '순위',
    description: '돈/레벨 순위를 출력합니다.',
    options: [
        {
            name: '분야',
            type: 'STRING',
            description: '출력할 순위의 분야를 입력해주세요.',
            required: true,
            choices: [
                {
                    name: '돈',
                    value: 'money'
                },
                {
                    name: '레벨',
                    value: 'level'
                }
            ]
        }
    ],

    async execute(interaction) {
        var fields = [];
        var field = [];
        const filePath = fs.readdirSync('./data').filter(file => file.endsWith('.json'));
        
        var fileNumber = 0;

        for (const file of filePath) {
            const data = JSON.parse(fs.readFileSync(`./data/${file}`, "utf-8"));
            field.push({ id: data.id, money: data.money, xp: data.xp, level: data.level });
            i++;
            if (fileNumber < 10) fileNumber++;
        }
        function commas(num) {
            var parts = num.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        const topic = interaction.options.getString('분야');
        switch (topic) {
            case 'money':
                field.sort(function (a, b) {
                    return b.money - a.money;
                });
                for (var i = 0; i < fileNumber; i++) {
                    fields.push({ name: `${i + 1}위`, value: `<@${field[i].id}> 님: ${commas(field[i].money)}원` });
                }
                interaction.reply({ embeds: [new MessageEmbed().setTitle("돈 순위").addFields(fields).setColor("BLUE")] });
                break;

            case 'level':
                field.sort(function (a, b) {
                    return b.xp - a.xp;
                });
                for (var i = 0; i < fileNumber; i++) {
                    fields.push({ name: `${i + 1}위`, value: `<@${field[i].id}> 님: ${field[i].level}레벨 (${commas(field[i].xp)}XP)` });
                }
                interaction.reply({ embeds: [new MessageEmbed().setTitle("레벨 순위").addFields(fields).setColor("BLUE")] });
                break;

            default:
                interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("어떤 순위를 출력할 것인지 올바르게 입력해주세요.").setColor("RED")] });
                break;
        }
    }
}