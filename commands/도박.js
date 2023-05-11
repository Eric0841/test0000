/**
 * [ README ]
 * 본 코드는 개발자 Lda2#2968 에 의해 쓰여진 코드입니다.
 * 본 코드는 돈을 받고 판매되고 있는 코드입니다.
 * 따라서 무단 복제 및 배포는 절대 금지됩니다.
 * 발각 시 법적으로 대응할 예정입니다.
 */

const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '도박',
    description: '도박 게임을 시작합니다.',
    options: [
        {
            name: '도박',
            type: 'STRING',
            description: '시작할 도박을 선택해주세요.',
            required: true,
            choices: [
                {
                    name: '주사위',
                    value: 'rps'
                },
                {
                    name: '야바위',
                    value: 'cup'
                }
            ]
        },
        {
            name: '배팅금',
            type: 'INTEGER',
            description: '배팅할 코인을 입력해주세요.',
            required: true,
        }
    ],

    async execute(interaction) {
        // 기본 변수 설정
        const { id, name } = { id: interaction.user.id, name: interaction.user.username }
        const filePath = `./data/${id}.json`;
        const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const { money, date, xp, level } = { money: user.money, date: user.date, xp: user.xp, level: user.level }

        const gamble = interaction.options.getString('도박');
        const betted = interaction.options.getInteger('배팅금');

        function commas(num) {
            var parts = num.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }

        // 구매 코드
        if (betted > 0) {
            if (money >= betted) {
                switch (gamble) {
                    case "rps":
                        const Player_1 = Math.floor(Math.random() * 6 + 1);
                        const Player_2 = Math.floor(Math.random() * 6 + 1);
                        const Match_1 = Math.floor(Math.random() * 6 + 1);
                        const Match_2 = Math.floor(Math.random() * 6 + 1);
                        var result;
                        if (Player_1 + Player_2 > Match_1 + Match_2) {
                            result = [`🎲 <@${id}>, 이겼습니다! 배팅한 코인의 1.5배를 드렸어요.\n현재 코인: **${commas(money + betted/2)}코인**`, `🎲 <@${id}>, 대단해요, 1.5배의 코인을 받아가세요.\n현재 코인: **${commas(money + betted/2)}코인**`];
                            result = result[Math.floor(Math.random() * 2)];
                            Game_End(true);
                        } else if (Player_1 + Player_2 < Match_1 + Match_2) {
                            result = [`🎲 <@${id}>, 졌습니다! 배팅한 코인을 잃었어요.\n현재 코인: **${commas(money - betted)}코인**`, `🎲 <@${id}>, 아쉽네요, 배팅한 코인은 가져갈게요.\n현재 코인: **${commas(money - betted)}코인**`];
                            result = result[Math.floor(Math.random() * 2)];
                            Game_End(false);
                        } else {
                            result = [`🎲 <@${id}>, 비겼습니다! 배팅한 코인은 돌려드릴게요.\n현재 코인: **${commas(money)}코인**`, `🎲 <@${id}>, 비겼네요, 배팅한 코인은 가져가세요.\n현재 코인: **${commas(money)}코인**`];
                            result = result[Math.floor(Math.random() * 2)];
                        };
                        interaction.reply({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님이 ${commas(betted)}코인을 걸고 주사위를 던졌습니다.`).setColor("2F3136")] });
                        setTimeout(() => {
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님은 ${Player_1}, 그리고 ${Player_2} 이(가) 나왔습니다.`).setColor("2F3136")] });
                            setTimeout(() => {
                                interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`🎲 <@${id}> 님의 상대는 ${Match_1}, 그리고 ${Match_2} 이(가) 나왔습니다.`).setColor("2F3136")] });
                                setTimeout(() => {
                                    interaction.channel.send({ embeds: [new MessageEmbed().setDescription(result).setColor("2F3136")] });
                                }, 3000);
                            }, 3000);
                        }, 3000);
                        function Game_End(WIN) {
                            switch (WIN) {
                                case true:
                                    fs.writeFileSync(filePath, JSON.stringify({ id, name, money: money + betted/2, date, xp, level, chat: user.chat, float: user.float }));
                                    break;

                                case false:
                                    fs.writeFileSync(filePath, JSON.stringify({ id, name, money: money - betted, date, xp, level, chat: user.chat, float: user.float }));
                                    break;
                            }
                        }
                        break;

                    case "cup":
                        var Answer = Math.floor(Math.random() * 3 + 1);
                        var Picture = "";
                        const MainPic = "https://media.discordapp.net/attachments/728822550125084674/833892283958820864/2.png";
                        if (Answer == 1) Picture = "https://media.discordapp.net/attachments/728822550125084674/834266062979727440/-1.png";
                        if (Answer == 2) Picture = "https://media.discordapp.net/attachments/728822550125084674/834266059245617152/-2.png";
                        if (Answer == 3) Picture = "https://media.discordapp.net/attachments/728822550125084674/834266056415248454/-3.png";


                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('first')
                                    .setLabel('첫번째 컵')
                                    .setStyle('SUCCESS'),
                            ).addComponents(
                                new MessageButton()
                                    .setCustomId('second')
                                    .setLabel('두번째 컵')
                                    .setStyle('SUCCESS')
                            ).addComponents(
                                new MessageButton()
                                    .setCustomId('third')
                                    .setLabel('세번째 컵')
                                    .setStyle('SUCCESS')
                            ).addComponents(
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('취소')
                                    .setStyle('DANGER')
                            )
                        const filter = i => i.user.id === interaction.user.id;

                        await interaction.reply({
                            embeds:
                                [new MessageEmbed()
                                    .setTitle("야바위 게임")
                                    .setDescription(`<@${interaction.user.id}> 님이 ${commas(betted)}코인을 걸고 야바위 게임을 시작했습니다.\n아래 세 컵 중 한 컵을 골라 번호 클릭해주세요.\n코인이 들어있는 컵을 고르면 배팅한 코인의 두 배를 드릴게요!`)
                                    .setImage(MainPic)
                                    .setColor("#FFFFF0")],
                            components: [row]
                        });
                        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });
                        collector.on('collect', async i => {
                            try {
                                await i.deferUpdate();
                            } catch (error) {

                            }
                            switch (i.customId) {
                                case "first":
                                    Picked(1);
                                    break;

                                case "second":
                                    Picked(2);
                                    break;

                                case "third":
                                    Picked(3);
                                    break;

                                case "cancel":
                                    Picked(4);
                                    break;
                            }
                            async function Picked(Cup) {
                                if (Cup == 4) {
                                    return await i.editReply({ embeds: [new MessageEmbed().setTitle("야바위 게임").setDescription(`야바위 게임이 취소되었습니다.\n코인이 들어있는 컵은 ${Answer}번이었습니다.`).setImage(Picture).setColor("#FFFFF0")], components: [] })
                                }
                                else if (Cup == Answer) {
                                    await i.editReply({ embeds: [new MessageEmbed().setTitle("야바위 게임").setDescription(`<@${interaction.user.id}>, 정답입니다! 배팅한 코인의 두 배를 드렸어요.` + '```+ ' + commas(betted * 2) + '코인```').setColor('#FFFFF0').setImage(Picture)], components: [] });
                                    return fs.writeFileSync(filePath, JSON.stringify({ id, name, money: money + betted, date, xp, level, chat: user.chat, float: user.float }));
                                } else {
                                    await i.editReply({ embeds: [new MessageEmbed().setTitle("야바위 게임").setDescription(`<@${interaction.user.id}>, 틀렸습니다! 배팅한 코인을 잃었어요.` + '```- ' + commas(betted) + '코인```').setColor('#FFFFF0').setImage(Picture)], components: [] });
                                    return fs.writeFileSync(filePath, JSON.stringify({ id, name, money: money - betted, date, xp, level, chat: user.chat, float: user.float }));
                                }
                            }
                        });
                        break;

                    default:
                        return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("입력한 게임을 찾을 수 없습니다.").setColor("RED")] });
                }
            } else {
                return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("코인이 부족합니다.").setColor("RED")] });
            }
        } else {
            return interaction.reply({ embeds: [new MessageEmbed().setTitle("오류").setDescription("배팅할 코인은 양의 정수여야 합니다.").setColor("RED")] });
        }
    }
}