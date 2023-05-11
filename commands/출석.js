var { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '출석',
    description: '출석 체크를 하여 코인 보상을 받습니다.',
    async execute(interaction) {
        function commas(num) {
            var parts = num.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        const { id, name } = { id: interaction.user.id, name: interaction.user.username }
        const filePath = `./data/${id}.json`;
        if (fs.existsSync(filePath)) {
            const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const today = new Date();
            const date = "" + today.getFullYear() + (today.getMonth() + 1) + today.getDate();
            if (user.date === date) return interaction.reply({ embeds: [new MessageEmbed().setTitle("출석 실패").setDescription("오늘은 이미 출석하셨습니다.\n**출석은 매일 오전 9시에 초기화됩니다.**").setColor("RED")] });
            const howMuch = 100 + (user.level - 1) * 20;
            fs.writeFileSync(filePath, JSON.stringify({ id, name, money: user.money + howMuch, date, xp: user.xp, level: user.level, chat: user.chat, float: user.float }));
            return interaction.reply({ embeds: [new MessageEmbed().setTitle("출석 성공").setDescription(`**${commas(howMuch)}원**이 지급되었습니다.`).setColor("GREEN")] });
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle('오류').setDescription('이 명령어를 사용하려면 경제 시스템에 가입해야합니다.').setColor("RED")], ephemeral: true });
        }
    }
}