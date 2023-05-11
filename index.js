const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const ls = require('./level.json');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    partials: ["CHANNEL", "MESSAGE"]
});
const { RED, GREEN, BLUE } = { RED: "#ff5454", GREEN: "#54ff62", BLUE: "#38e1ff" }

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));
client.commands = new Collection();
var data = [];
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    data.push({ name: command.name, description: command.description, options: command.options });
}

client.once('ready', async () => {
    console.log(`${client.user.tag} (으)로 로그인됨`);
    client.guilds.cache.forEach(gd => { gd.commands.set(data); });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!client.commands.has(interaction.commandName)) return;
    const command = client.commands.get(interaction.commandName);

    const { id, name } = { id: interaction.user.id, name: interaction.user.username };
    const filePath = `./data/${id}.json`;
    !fs.existsSync(filePath) ? fs.writeFileSync(filePath, JSON.stringify({ id, name, money: 0, date: "", xp: 0, level: 1, chat: 100, float: 0 })) : null;

    try {
        command.execute(interaction, client);
    } catch (error) {
        console.log(error);
    }
});

// 메시지 이벤트
client.on('messageCreate', async message => {
    if (message.channel.type === "dm" || message.author.bot) return;

    if (message.channel.id !== "947440994801045534") return;

    // 끝말잇기
    Channel = message.channel;
    var EMBED = new MessageEmbed();
    if (IsGamePlaying) {
        if (IsUserTurn) {
            for (var i = 0; i < SEQUENCE.length; i++) {
                if (message.author.id == SEQUENCE[i].Userid) {
                    if (SEQUENCE[i].Turn == NowTurn) {
                        return next();
                    };
                };
            };
            function next() {
                IsUserTurn = false;
                var word = message.content;
                main(word, message);
            };
        };
    };
    if (!message.content.includes("!끝말잇기")) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift();
    if (command == "끝말잇기") {
        if (!IsGamePlaying) {
            switch (args[0]) {
                case "시작":
                    if (IsGameReady) return Channel.send({ embeds: [EMBED.setTitle(Messages.GAME.GAME_READY_ERROR.TITLE).setDescription(Messages.GAME.GAME_READY_ERROR.DESCRIPTION).setColor(RED)], ephemeral: true });
                    return Game_Ready(message);
                case "참가":
                    if (!IsGameReady) return Channel.send({ embeds: [EMBED.setTitle(Messages.GAME.GAME_NOT_READY.TITLE).setDescription(Messages.GAME.GAME_NOT_READY.DESCRIPTION).setColor(RED)], ephemeral: true });
                    if (IsGamePlaying) return Channel.send({ embeds: [EMBED.setTitle(Messages.GAME.GAME_PLAYING.TITLE).setDescription(Messages.GAME.GAME_PLAYING.DESCRIPTION).setColor(RED)], ephemeral: true });
                    return Join_Player(message, false);
                case "나가기":
                    if (IsGamePlaying) return Channel.send({ embeds: [EMBED.setTitle(Messages.GAME.GAME_PLAYING.TITLE).setDescription(Messages.GAME.GAME_PLAYING.DESCRIPTION).setColor(RED)], ephemeral: true });
                    return Game_Leave(message);

                default:
                    return Channel.send({
                        embeds: [EMBED.setTitle(Messages.COMMAND_NOT_FOUND_ARGS.TITLE).setDescription(Messages.COMMAND_NOT_FOUND_ARGS.DESCRIPTION)
                            .setColor(RED)], ephemeral: true
                    });
            };
        };
    };
})

client.on('guildCreate', async guild => {
    client.guilds.cache.get(guild.id).commands.set(data);
});

const keepAlive = require('./server.js');
keepAlive();
client.login(process.env.TOKEN);