const makeEmbed = require("../Functions/embed");
const { Collection, MessageEmbed } = require("discord.js");
const noblox = require("noblox.js");
const axios = require("axios");

module.exports = {
  name: "connection",
  description: "Checks if the APIs are still available.",
  async execute(message, args, client) {
    let robloxId = "Tschyken";
    let robloxAPI = "ROBLOX API: ❓";
    let mongoApi = "MONGODB API: ❓"; 
    let discordApi = "DISCORD API: ❓"; // Set default value to indicate unknown status
         
    async function checkMongoDBStatus() {
      try {
        const response = await axios.get("https://api.mongodb.com/");

        if (response.status === 200) {
          mongoApi = "MONGODB API: ✅"; // Update value to indicate available status
        } else {
          mongoApi = "MONGODB API: ❌"; // Update value to indicate unavailable status
        }
      } catch (error) {
        console.error("An error occurred while checking MongoDB API status", error);
        mongoApi = "MONGODB API: ❌"; // Update value to indicate error status
      }
    }
    async function checkRobloxStatus() {
        try {
  
          let robloxUsername = noblox.getIdFromUsername(robloxId)
          robloxAPI = "ROBLOX API: ✅"
        } catch (error) {
          robloxAPI = "ROBLOX API: ❌"
        }
      }

    try {
     await checkRobloxStatus(); 
      await checkMongoDBStatus(); // Call the function to check MongoDB API status
      const m = await message.channel.send("Checking API.");


      const ping = m.createdTimestamp - message.createdTimestamp;

      if ( ping  < 499) {
        discordApi = "DISCORD API: ✅"; // Update value to indicate good status
      } else if (ping < 999) {
        discordApi = "DISCORD API: ⚠️"; // Update value to indicate moderate status
      } else if  (ping < 1000) {
        discordApi = "DISCORD API: ❌"; // Update value to indicate poor status
      }
      const apiIsActive = makeEmbed(
        "Connections!",
        `${robloxAPI}\n${mongoApi}\n${discordApi}`,
        "DARK_GREEN",
        "Success | Connection"
      );
      message.reply({ embeds: [apiIsActive] });
    } catch (error) {
      console.error("An error occurred while checking API status", error);

      const apiIsNotActive = makeEmbed(
        "Connections!",
        `${robloxAPI}\n${mongoApi}\n${discordApi}`,
        "DARK_RED",
        "Error | Connection"
      );
      message.reply({ embeds: [apiIsNotActive] });
    }
  }
};