const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

// --- 1. KEEP-ALIVE SERVER ---
const app = express();
app.get('/', (req, res) => res.send('Bot is Awake!'));
app.listen(process.env.PORT || 3000);

// --- 2. CONFIGURATION ---
const FIREBASE_URL = "https://tixbot3000-default-rtdb.firebaseio.com/Codes";
const BOT_TOKEN = "PASTE_YOUR_DISCORD_TOKEN_HERE";

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const TRIVIA = [
    { q: "What is the main currency in Banished 2?", a: "Tix", prize: 500 },
    { q: "Who is the owner of Banished 2?", a: "Mixamona", prize: 1000 },
    { q: "What is 50 + 50?", a: "100", prize: 200 }
];

client.on('messageCreate', async (msg) => {
    if (msg.content.toLowerCase() === "!trivia") {
        const item = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
        msg.channel.send(`🧠 **TRIVIA:** ${item.q}`);

        const filter = m => m.content.toLowerCase() === item.a.toLowerCase();
        const collector = msg.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async (m) => {
            const code = "BANISHED-" + Math.random().toString(36).toUpperCase().substring(2, 8);
            await axios.put(`${FIREBASE_URL}/${code}.json`, { reward: item.prize });
            m.reply(`✅ Correct! DM sent.`);
            m.author.send(`🏆 Code: \`${code}\` (${item.prize} Tix)`);
        });
    }
});

client.login(BOT_TOKEN);
