var { Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "상점",
    description: "상점 명령어입니다.",
    options: [
        {
            name: "목록",
            description: "구매 가능한 아이템 목록을 출력합니다.",
            type: "SUB_COMMAND"
        },
        {
            name: "구매",
            description: "아이템을 구매합니다.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "아이템",
                    description: "구매할 아이템을 입력해주세요.",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    async execute(interaction) {

        const id = interaction.user.id;
        const name = interaction.user.username;

        const filePath = `./dungeon/${id}.json`;
        !fs.existsSync(filePath) ? fs.writeFileSync(filePath, JSON.stringify({ id, name, power: 0, dungeon: "none", joinAt: "none" })) : null;
        const dg_data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const userFile = `./data/${id}.json`;
        const user = JSON.parse(fs.readFileSync(userFile, "utf-8"));

        const args = interaction.options.getSubcommand();

        const items = [
            ["장검", 400, 10],
            ["은날검", 800, 40],
            ["강철검", 1200, 160],
            ["검투사의 검", 1600, 600],
            ["장군의 검", 2000, 2500],
            ["군주의 검", 2400, 10000],
            ["천상의 검", 2800, 40000],
            ["낚시 미끼", 100, 0]
        ]

        if (args === "목록") {
            const shopEmbed = new MessageEmbed()
                .setTitle("상점")
                .setDescription("```상품       가격(코인)     능력치(전투력)\n\n장검             400                10\n은날검           800                40\n강철검           1200              160\n검투사의 검      1600               600\n장군의 검        2000              2500\n군주의 검        2400             10000\n천상의 검        2800             40000\n낚시 미끼         100              없음```")
                .setColor("BLUE")
            interaction.reply({ embeds: [shopEmbed] })
        }
        if (args === "구매") {
            const item = interaction.options.getString("아이템");
            var bought;

            for (var i = 0; i < items.length; i++) {
                if (items[i][0] === item) {
                    if (!bought) {
                        bought = true;
                        if (items[i][1] > user.money) return interaction.reply({ embeds: [new MessageEmbed().setTitle("잔액이 부족합니다.").setDescription(`현재 잔액: ${user.money}코인`).setColor("RED")] });
                        interaction.reply({ embeds: [new MessageEmbed().setTitle("구매 성공").setDescription(`${items[i][0]} 아이템을 구매했습니다.`).setColor("GREEN")] });
                        fs.writeFileSync(filePath, JSON.stringify({ id, name, power: dg_data.power + items[i][2], dungeon: dg_data.dungeon, joinAt: dg_data.joinAt }));
                        if (items[i][0] === "낚시 미끼") {
                            fs.writeFileSync(userFile, JSON.stringify({ id, name, money: user.money - items[i][1], date: user.date, xp: user.xp, level: user.level, chat: user.chat, float: user.float + 1 }));
                        } else {
                            fs.writeFileSync(userFile, JSON.stringify({ id, name, money: user.money - items[i][1], date: user.date, xp: user.xp, level: user.level, chat: user.chat, float: user.float }));
                        }
                    }
                } else {
                    if (!bought) bought = false;
                }
            }

            if (!bought) interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("입력한 아이템을 찾을 수 없습니다.\n(띄어쓰기와 철자 오타가 있는지 확인바람)").setColor("RED")] })
        }
    }
}