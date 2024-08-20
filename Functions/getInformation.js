const noblox = require('noblox.js');

async function getRobloxProfile(username) {
  try {
    const userId = await noblox.getIdFromUsername(username);
    const playerInfo = await noblox.getPlayerInfo(parseInt(userId));

    const robloxJoinDate = playerInfo.age;
    const friendsCount = playerInfo.friendCount;
    const previousNames = playerInfo.oldNames;

    return {
      userId,
      robloxJoinDate,
      friendsCount,
      previousNames,
    };
  } catch (error) {
    console.error('Error occurred during background check:', error);
    throw error;
  }
}

module.exports = { getRobloxProfile };