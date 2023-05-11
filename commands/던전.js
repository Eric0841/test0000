var { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '던전',
    description: '던전 관련 명령어입니다.',
    options: [
        {
            name: "목록",
            description: "던전의 목록을 확인합니다.",
            type: "SUB_COMMAND",
        },
        {
            name: "입장",
            description: "던전에 입장합니다.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "던전",
                    description: "입장할 던전을 입력해주세요.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "퇴장",
            description: "현재 입장중인 던전에서 퇴장합니다.",
            type: "SUB_COMMAND"
        }
    ],

    async execute(interaction) {
        const id = interaction.user.id;
        const name = interaction.user.username;

        const filePath = `./dungeon/${id}.json`;
        !fs.existsSync(filePath) ? fs.writeFileSync(filePath, JSON.stringify({ id, name, power: 0, joinAt: "", dungeon: "null" })) : null;
        const dg_data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const userFile = `./data/${id}.json`;
        const user = JSON.parse(fs.readFileSync(userFile, "utf-8"));

        const args = interaction.options.getSubcommand();

        const dungeons = [
            ['달팽이 던전', 0, 10],
            ['돼지 던전', 10, 20],
            ['슬라임 던전', 50, 30],
            ['버섯 던전', 300, 40],
            ['멧돼지 던전', 2000, 50],
            ['해골 던전', 15000, 60],
            ['유령 던전', 100000, 70],
            ['암흑 던전', 500000, 100]
        ];

        if (args === "목록") {
            var field = [];

            for (var i = 0; i < dungeons.length; i++) {
                field.push({ name: `${dungeons[i][0]}`, value: `입장조건: 전투력 ${dungeons[i][1]}\n최대보상: ${dungeons[i][2]}코인, ${dungeons[i][2]}XP` });
            }

            const dungeonList = new MessageEmbed()
                .setTitle("던전 목록")
                .setDescription("입장한 후 10시간 이상이 지나면 최대보상을 수령가능합니다.")
                .setColor("BLUE")
                .addFields(field)
                .setFooter(`현재 전투력: ${dg_data.power}`)

            interaction.reply({ embeds: [dungeonList] });
        }

        if (args === "입장") {
            if (dg_data.dungeon === "null") {

                const dungeon = interaction.options.getString("던전");

                var bought;

                for (var i = 0; i < dungeons.length; i++) {
                    if (dungeons[i][0] === dungeon) {
                        if (!bought) {
                            bought = true;
                            if (dungeons[i][1] > dg_data.power) return interaction.reply({ embeds: [new MessageEmbed().setTitle("전투력이 부족합니다.").setDescription(`현재 전투력: ${dg_data.power}`).setColor("RED")] });
                            interaction.reply({ embeds: [new MessageEmbed().setTitle("입장 성공").setDescription(`${dungeons[i][0]}에 입장했습니다.`).setColor("GREEN")] });

                            var n = new Date();
                            var date = n.getDate();
                            var hours = n.getHours();
                            var minutes = n.getMinutes();

                            if (date < 10) date = "0" + date;
                            if (hours < 10) hours = "0" + hours;
                            if (minutes < 10) minutes = "0" + minutes;

                            const format = "" + date + hours + minutes;

                            fs.writeFileSync(filePath, JSON.stringify({ id, name, power: dg_data.power, dungeon: dungeons[i][0], joinAt: format }));
                        }
                    } else {
                        if (!bought) bought = false;
                    }
                }

                if (!bought) interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("입력한 던전을 찾을 수 없습니다.\n(띄어쓰기와 철자 오타가 있는지 확인바람)").setColor("RED")] });

            } else {
                return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription(`이미 던전에 입장했습니다.`).setColor("RED")] });
            }
        }

        if (args === "퇴장") {
            if (dg_data.dungeon !== "null") {

                for (var i = 0; i < dungeons.length; i++) {
                    if (dungeons[i][0] === dg_data.dungeon) {

                        var n = new Date();
                        var Ndate = n.getDate();
                        var Nhours = n.getHours();
                        var Nminutes = n.getMinutes();

                        if (Ndate < 10) Ndate = "0" + Ndate;
                        if (Nhours < 10) Nhours = "0" + Nhours;
                        if (Nminutes < 10) Nminutes = "0" + Nminutes;

                        const b = dg_data.joinAt;
                        const Bdate = b.slice(0, 2).slice(4, 2);
                        const Bhours = b.slice(0, 4);
                        const Bminutes = b.slice(4);

                        var deference = Number("" + Ndate + Nhours + Nminutes) - Number(Bdate + Bhours + Bminutes);

                        function maxReward() {
                            if (deference < 0) return true;
                            if (deference < 600) return false;
                            else return true;
                        }

                        var reward;

                        if (maxReward() == true) {
                            for (var i = 0; i < dungeons.length; i++) {
                                if (dungeons[i][0] === dg_data.dungeon) {
                                    reward = dungeons[i][2];
                                }
                            }
                        } else {
                            for (var i = 0; i < dungeons.length; i++) {
                                if (dungeons[i][0] === dg_data.dungeon) {
                                    reward = Math.floor(dungeons[i][2] / 60 * (deference));
                                }
                            }
                        }

                        fs.writeFileSync(filePath, JSON.stringify({ id, name, power: dg_data.power, dungeon: "null", joinAt: "null" }));

                        fs.writeFileSync(userFile, JSON.stringify({ id, name, money: user.money + reward, date: user.date, xp: user.xp + reward, level: user.level, chat: user.chat, float: user.float }));

                        interaction.reply({ embeds: [new MessageEmbed().setTitle("퇴장 성공").setDescription(`${dg_data.dungeon}에서 ${deference}분만에 퇴장하여, ${reward}코인과 ${reward}XP 보상을 수령했습니다!`).setColor("GREEN")] });
                    }
                }

            } else {
                return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription(`아무 던전에도 입장해있지 않습니다.`).setColor("RED")] });
            }
        }
    }
}