const noblox = require('noblox.js');
const axios = require('axios');
const { getRobloxProfile } = require("../Functions/getInformation");

async function getBlacklist(username) {
  try {
    const profileInfo = await getRobloxProfile(username);
    const pastUsernames = profileInfo.previousNames;
    let responses;

    try {
      responses = await axios.all([
        axios.get(
          `` // add your own trello api, removed so random people cant spam with my name
        ),
      ]);
    } catch (error) {
      console.error("Failed to fetch Trello cards:", error);
      return;
    }

    // Filter cards with old username and current
    const foundCards = responses[0]?.data?.filter((card) => {
      const name = card.name;
      return name === username || pastUsernames.includes(name);
    });

    const hasCards = foundCards?.length > 0;
    const blacklistLinks = [];

    // Build the blacklists field
    let blacklists = "";
    if (hasCards) {
      foundCards.forEach((card) => {
        const cardLink = `**[${card.name}]** ${card.shortUrl}`;
        blacklistLinks.push(cardLink);
      });
      blacklists = blacklistLinks.join("|"); // Join the card links using a line break
    } else {
      blacklists = "None";
    }

    return { blacklists };
  } catch (error) {
    console.error("Error occurred during blacklists retrieval:", error);
  }
}

module.exports = { getBlacklist };
