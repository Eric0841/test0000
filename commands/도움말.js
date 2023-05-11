var { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '도움말',
    description: '도움말을 확인합니다.',
    forAdmin: false,

    async execute(interaction) {
        var forAdmin = false;
        if (interaction.member.permissions.has('ADMINISTRATOR')) forAdmin = true;
        const fields = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        if (forAdmin) {
            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                fields.push({ name: command.name, value: command.description });
            }
        } else {
            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                if (!command.forAdmin) {
                    fields.push({ name: command.name, value: command.description });
                }
            }
        }

        return interaction.reply({ embeds: [new MessageEmbed().setTitle("명령어 목록").addFields(fields).setColor("BLUE")] });
    }
};