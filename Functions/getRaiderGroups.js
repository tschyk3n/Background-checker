const noblox = require('noblox.js');
const axios = require('axios');
const { getRobloxProfile } = require("../Functions/getInformation");

let raidingGroupInfo = [
    { groupId: 8675204, groupName: "[TDR] The Dark Resistance" },
    { groupId: 7033913, groupName: `Order of The Ninth's Revenge` },
    { groupId: 2981881, groupName: "Hydra International" },
    { groupId: 10937425, groupName: "Order of the Valkyrie" },
    { groupId: 5691294, groupName: "[Tнe Iппeя Ciяcle]" },
    { groupId: 8224374, groupName: "[DoJ] Department of Justice ." },
    { groupId: 9723651, groupName: "[TC] The Commandos" },
    { groupId: 7281267, groupName: "Phalanx" },
    { groupId: 10565618, groupName: "Venomous" },
    { groupId: 9550235, groupName: "[TRI] The Romanian Insurgency" },
    { groupId: 8339712, groupName: "[TSI] The Steel Insurgence" },
    { groupId: 6544420, groupName: "Jokers Riot" },
    { groupId: 6281575, groupName: "French Elite" },
    { groupId: 6540835, groupName: "[RTU] Reapers Of The Underworld" },
    { groupId: 5241070, groupName: "RIPguests Regime" },
    { groupId: 7371298, groupName: "The Black Business (old)" },
    { groupId: 12386509, groupName: "The Black Business (new)" },
    { groupId: 7953105, groupName: "Aces Empire" },
    { groupId: 14018648, groupName: "[T3V] The 3 Victorius" },
    { groupId: 11117772, groupName: "[PHNX] Phalanx" },
  ];
  async function getRaiderGroup(username) {
    const { userId } = await getRobloxProfile(username);
  
    let raidingRankPromises = raidingGroupInfo.map(async (group) => {
      const rankName = await noblox.getRankNameInGroup(group.groupId, userId);
  
      if (rankName && rankName !== "Guest") {
        return `${group.groupName} ${rankName}`;
      }
      return null;
    });
  
    let raidingRanks = await Promise.all(raidingRankPromises);
    raidingRanks = raidingRanks.filter((rank) => rank !== null);
  
    if (raidingRanks.length === 0) {
      return { formatedRank: "Nothing suspicious" };
    }
  
    let formatedRank = raidingRanks.join(" | ");
    return { formatedRank };
  }
  
module.exports = { getRaiderGroup };
