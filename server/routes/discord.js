import express from "express";
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config({ path: "./config.env" });

const router = express.Router();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const DiscordBotKey = process.env.DiscordBotKey;
client.login(DiscordBotKey);

// Route to fetch all users and their roles from the Discord server
router.get('/api/discord-users', async (req, res) => {
  const guild = client.guilds.cache.get(process.env.ServerID);
  if (!guild) {
    console.log('Guild not found');
    return res.status(404).send('Guild not found');
  }

  try {
    const members = await guild.members.fetch();
    const users = members.map(member => ({
      id: member.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      roles: member.roles.cache.map(role => ({
        id: role.id,
        name: role.name,
        color: role.color,
      })),
    }));

    res.json(users);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    res.status(500).send('Failed to fetch members');
  }
});

// OAuth2 callback route
router.get('/api/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Code not provided");
  }

  try {
    const data = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `http://localhost:3000/api/discord/callback`
    });

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Ideally, here you should fetch the user's roles from your guild
    const guild = client.guilds.cache.get(process.env.ServerID);
    let roles = [];
    if (guild) {
      const member = await guild.members.fetch(userResponse.data.id);
      roles = member.roles.cache.map(role => ({
        id: role.id,
        name: role.name,
        color: role.color,
      }));
    }

    const userData = {
      ...userResponse.data,
      roles: roles,
    };

    res.cookie('auth_token', access_token, { httpOnly: true, secure: true });
    res.redirect(`http://localhost:3001/success?data=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error('Error during code exchange or user data fetching:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
