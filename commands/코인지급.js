const { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '코인지급',
    description: '(관리자용 명령어) 유저에게 코인을 지급합니다.',
    options:
        [
            {
                name: '대상',
                type: 'USER',
                description: '지급할 대상을 입력해주세요.',
                required: true,
            },
            {
                name: '금액',
                type: 'NUMBER',
                description: '지급할 금액을 입력해주세요.',
                required: true,
            }
        ],

    async execute(interaction) {
        const target = interaction.options.getUser('대상');
        const Money = interaction.options.getNumber('금액');
        const FilePath = `./data/${target.id}.json`;

        if (!interaction.member.permissions.has('ADMINISTRATOR') || !interaction.member.roles.cache.has('947480222830329918')) return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setTitle("권한이 없습니다!")], ephemeral: true });

        if (fs.existsSync(FilePath)) {
            const TARGET = JSON.parse(fs.readFileSync(FilePath, "utf-8"));
                function commas(num) {
                    var parts = num.toString().split(".");
                    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
                }
                fs.writeFileSync(FilePath, JSON.stringify({ id: TARGET.id, name: TARGET.name, money: TARGET.money + Money, date: TARGET.date, xp: TARGET.xp, level: TARGET.level, chat: TARGET.chat, float: TARGET.float }));
                return interaction.reply({ embeds: [new MessageEmbed().setTitle('전송 성공').addFields({ "name": "대상", "value": `<@${target.id}>` }, { "name": "금액", "value": `${commas(Money)}원` }).setColor("GREEN")] });
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('전송 대상이 경제 시스템에 가입하지 않았습니다.').setColor("RED")], ephemeral: true });
        }
    }
}