const { interactionEmbed, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '낚시',
    description: '낚시를 시작합니다.',
    options: [
        {
            name: "미끼",
            description: "낚시에 사용할 미끼의 수를 입력해주세요. (최대값:5)",
            type: "INTEGER",
            required: true,
        }
    ],

    async execute(interaction) {

        function Reply(embed, ephemeral) {
            interaction.reply({ embeds: [embed], ephemeral });
        }

        const { id, name } = { id: interaction.user.id, name: interaction.user.username };
        const filePath = `./data/${id}.json`;
        const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const float = interaction.options.getInteger("미끼");

        const { money, date, xp, level, chat } = { money: user.money, date: user.date, xp: user.xp, level: user.level, chat: user.chat }

        const embed1 = new MessageEmbed()
            .setTitle("오류")
            .setDescription("찌의 개수는 양의 정수여야 합니다.")
            .setColor("RED")

        const embed2 = new MessageEmbed()
            .setTitle("오류")
            .setDescription("낚시를 한 번에 최대 5번씩만 할 수 있습니다.")
            .setColor("RED")

        const embed3 = new MessageEmbed()
            .setTitle("오류")
            .setDescription(`보유한 찌가 부족합니다. /상점\n현재 찌: ${user.float}`)
            .setColor("RED")

        if (isNaN(float) || float != Math.floor(float) || float < 1) return Reply(embed1, true);
        if (float > 5) return Reply(embed2, true);
        if (user.float < float) return Reply(embed3, true);

        const fishes = [
            ["깡통", 0], ["담배꽁초", 0], ["오징어", 40], ["조개", 42], ["숭어", 45], ["아귀", 80], ["흑새치", 84], ["실꼬리돔", 90], ["다금바리", 200], ["쏘가리", 210], ["대왕문어", 250]
        ];

        var field = [];
        var result = 0;

        for (var i = 1; i <= float; i++) {
            const fish = fishes[Math.floor(Math.random() * fishes.length)];
            field.push({ name: `${fish[0]}`, value: `${fish[1]}XP` });
            result = result + fish[1];
        }

        const embed4 = new MessageEmbed()
            .setTitle("낚시 결과")
            .setDescription(`획득: +${result}XP`)
            .addFields(field)
            .setColor("BLUE")

        var sec = float * 2;

        interaction.reply({ embeds: [new MessageEmbed().setDescription(`낚시 중... ${sec}초`).setColor("BLUE")] });

        var i = sec - 2;

        const interval = setInterval(() => {
            if (i >= 0) {
                interaction.editReply({ embeds: [new MessageEmbed().setDescription(`낚시 중... ${i + 1}초`).setColor("BLUE")] });
                i--;
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            interaction.editReply({ embeds: [embed4] });
        }, sec * 1000);

        fs.writeFileSync(filePath, JSON.stringify({ id, name, money, date, xp: xp + Number(result), level, chat, float: user.float - Number(float) }));
    }
}