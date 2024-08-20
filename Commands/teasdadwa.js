const makeEmbed = require("../Functions/embed");
const { Collection, MessageEmbed } = require("discord.js");
const noblox = require("noblox.js");
const axios = require("axios");
require('dotenv').config(); // Load environment variables from .env file
const fetch = require('node-fetch');

module.exports = {
  name: "dadwawda",
  description: "Checks if the APIs are still available.",
  async execute(message, args, client) {


    const discordId = '694669514687774731'; // Replace with the Discord user ID
    const apiKey = process.env.ROVER_API; // Access Rover API key from environment variables

    async function checkVerificationWithRoVer(discordId) {
      try {
        const response = await fetch(`https://registry.rover.link/api/guilds/:guildId/discord-to-roblox/${discordId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
    
        const data = await response.json();
    
        if (response.ok) {
          if (data.robloxId) {
            console.log(`Discord user ${discordId} is verified with RoVer.`);
            console.log(`Associated Roblox account details:`, data);
          } else {
            console.log(`Discord user ${discordId} is not verified with RoVer.`);
          }
        } else {
          console.error('Error:', data.errorCode, data.message);
        }
      } catch (error) {
        console.error('Error occurred while checking verification:', error);
      }
    }
    
    
    checkVerificationWithRoVer(discordId);

  }
};