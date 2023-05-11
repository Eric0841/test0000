var { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "문의",
    description: "문의 채널을 생성합니다.",

    async execute(interaction, client) {
        const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone")
        interaction.guild.channels.create(`문의ㅣ${interaction.user.tag}`, {
            type: "GUILD_TEXT",
            parent: "940656077232545832",
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: "945539374915911740",
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: "931819811065966662",
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: everyone.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ]
        }).then(c => {
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.tag} 님의 문의입니다.`)
                .setDescription(`관리자를 태그해주시면 문의를 보다 빠르게 확인할 수 있습니다.`)
                .setColor("BLUE")

            c.send({ embeds: [embed] });
        });

        interaction.reply({ content: "문의 채널이 생성되었습니다!", ephemeral: true });
    },
}