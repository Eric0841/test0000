/**
 * [ README ]
 * 본 코드는 개발자 Lda2#2968 에 의해 쓰여진 코드입니다.
 * 본 코드는 돈을 받고 판매되고 있는 코드입니다.
 * 따라서 무단 복제 및 배포는 절대 금지됩니다.
 * 발각 시 법적으로 대응할 예정입니다.
 */

var { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '레벨',
    description: '자신이나 지정한 유저의 레벨을 확인합니다.',
    options: [
        {
            name: '대상',
            type: 'USER',
            description: '레벨을 확인할 유저를 지정해주세요. (지정하지 않으면 자신의 레벨을 확인합니다.)',
            required: false,
        }
    ],

    async execute(interaction) {
        var filePath;
        var target = interaction.options.getUser('대상');
        !target ? filePath = `./data/${interaction.user.id}.json` : filePath = `./data/${target.id}.json`;
        if (fs.existsSync(filePath)) {
            const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            function commas(num) {
                var parts = num.toString().split(".");
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }
            return interaction.reply({ embeds: [new MessageEmbed().setTitle(`${user.name}의 레벨`).setDescription(`${user.level}레벨 (${commas(user.xp)}XP)`).setColor("BLUE")] });
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('대상의 레벨 정보를 불러올 수 없습니다.').setColor("RED")], ephemeral: true });
        }
    }
}