var { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '코인',
    description: '자신이나 지정한 유저의 코인을 확인합니다.',
    options: [
        {
            name: '대상',
            type: 'USER',
            description: '코인을 확인할 유저를 지정해주세요. (지정하지 않으면 자신의 코인을 확인합니다.)',
            required: false,
        }
    ],

    async execute(interaction) {
        var target;
        !interaction.options.getUser('대상') ? target = interaction.user : target = interaction.options.getUser('대상');

        const filePath = `./data/${target.id}.json`;
        if (fs.existsSync(filePath)) {
            const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            function commas(num) {
                var parts = num.toString().split(".");
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }
            return interaction.reply({ embeds: [new MessageEmbed().setTitle(`${user.name}의 코인`).setDescription(`${commas(user.money)}코인`).setColor("BLUE")] });
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('대상의 코인 정보를 불러올 수 없습니다.').setColor("RED")], ephemeral: true });
        }
    }
}