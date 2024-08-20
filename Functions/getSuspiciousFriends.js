const fs = require('fs');
const path = require('path');
const noblox = require('noblox.js');
const { getRobloxProfile } = require('../Functions/getInformation');
const axios = require('axios');

async function getSusFriends(username) {
  const { userId } = await getRobloxProfile(username);

  try {
    let nextCursor = "";
    const friendIds = [];

    do {
      const response = await axios.get(
        `https://friends.roblox.com/v1/users/${userId}/friends?cursor=${nextCursor}`
      );

      // Extract friend IDs from the response
      const data = response.data;
      friendIds.push(...data.data.map(friend => friend.id));

      nextCursor = data.nextPageCursor;
    } while (nextCursor);

    const filePath = path.join(__dirname, '../Config/raidingMembers.json');
    const raidersData = fs.readFileSync(filePath, 'utf-8');
    const raiders = JSON.parse(raidersData);

    const susFriends = friendIds.filter(friendId => raiders.includes(friendId));

    // Generate profile links for the suspicious friends
    const profileLinks = susFriends.map(id => `https://www.roblox.com/users/${id}/profile`);

    if (susFriends.length === 0) {
      return ["No suspicious friends"];
    }

    return profileLinks;
  } catch (error) {
    console.error('Error retrieving user friends:', error.message);
    return [];
  }
}


module.exports = { getSusFriends };