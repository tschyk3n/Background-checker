const fs = require('fs');
const path = require('path');
const noblox = require('noblox.js');
const { getRobloxProfile } = require('../Functions/getInformation');
const axios = require('axios');

async function getSusFollowing(username) {
  const { userId } = await getRobloxProfile(username);

  try {
    let nextCursor = "";
    const followingIds = [];

    do {
      const response = await axios.get(
        `https://friends.roblox.com/v1/users/${userId}/followings?cursor=${nextCursor}`
      );

      // Extract friend IDs from the response
      const data = response.data;
      followingIds.push(...data.data.map(friend => friend.id));

      nextCursor = data.nextPageCursor;
    } while (nextCursor);

    const filePath = path.join(__dirname, '../Config/raidingMembers.json');
    const raidersData = fs.readFileSync(filePath, 'utf-8');
    const raiders = JSON.parse(raidersData);

    const susFollowings = followingIds.filter(friendId => raiders.includes(friendId));

    // Generate profile links for the suspicious friends
    const profileLinks = susFollowings.map(id => `https://www.roblox.com/users/${id}/profile`);

    if (susFollowings.length === 0) {
      return ["No suspicious following"];
    }6

    return profileLinks;
  } catch (error) {
    console.error('Error retrieving user following:', error.message);
    return [];
  }
}


module.exports = { getSusFollowing };