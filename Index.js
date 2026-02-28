const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// --- 1. KEEP-ALIVE SERVER (For Render 24/7) ---
const app = express();
app.get('/', (req, res) => res.send('Banished 2 Bot is Awake!'));
app.listen(process.env.PORT || 3000);

// --- 2. CONFIGURATION ---
const BOT_TOKEN = "MTQ3NzE2Mzg0NjE5NTIyMDY4Mw.Gwh8t1.Nr6f--FPFliKY-zZjMELVGlmgTz8Xvb9-PT-Ts";

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// These are the PRESET codes that already exist in your Roblox script
const TRIVIA_QUESTIONS = [
    { q: "What is the name of this game?", a: "Banished 2", code: "DFSJA94QHY9DSY78DSA", prize: "1,000" },
    { q: "Who is the owner?", a: "Mixamona", code: "Z1X2C3V4B5N6M7L8", prize: "5,000" },
    { q: "What is 100 + 100?", a: "200", code: "M8N5B2V9C1X4Z7L0", prize: "500" },
    { q: "What is the main currency?", a: "Tix", code: "Q2W4E6R8T0Y1U3I5", prize: "150" }
];

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase() === "!trivia") {
        const item = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
        
        msg.channel.send(`🧠 **TRIVIA TIME!**\n**Question:** ${item.q}\n*(First to answer wins a code for ${item.prize} Tix!)*`);

        const filter = m => m.content.toLowerCase() === item.a.toLowerCase();
        const collector = msg.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', async (m) => {
            m.reply(`✅ **CORRECT!** I have DM'd you the secret code.`);
            
            try {
                await m.author.send(`🏆 **YOU WON TRIVIA!**\n\nYour code is: \`${item.code}\`\nThis code is worth **${item.prize} Tix**.\n\nType \`/redeem ${item.code}\` in Banished 2 to claim it!`);
            } catch (err) {
                m.channel.send(`❌ **${m.author.username}**, I couldn't DM you! Please open your DMs.`);
            }
        });
    }
});

client.login(BOT_TOKEN);
