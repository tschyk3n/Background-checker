const noblox = require('noblox.js');
const axios = require('axios');
const { getRobloxProfile } = require("../Functions/getInformation");

let rankInfo = [
    { groupId: 4802792, groupName: "Red Army" },
    { groupId: 4901723, groupName: "Milisiya" },
    { groupId: 4849580, groupName: "CPSU" },
    { groupId: 4805092, groupName: "KGB" },
    { groupId: 5737557, groupName: "CRU" },
    { groupId: 5902649, groupName: "109th" },
    { groupId: 5157127, groupName: "Monarch" },
    { groupId: 5117666, groupName: "Biopreparet" },
    { groupId: 6018695, groupName: "Omon" },
    { groupId: 11934361, groupName: "MDD" },
    { groupId: 4291835, groupName: "Phoenix" },
    { groupId: 4805062, groupName: "Red Guard" },
    { groupId: 4808054, groupName: "Spetsnaz" },
    { groupId: 16467057, groupName: "SBT" },
    { groupId: 13300850, groupName: "AEEC" },
    { groupId: 5855498, groupName: "TSM" },
    { groupId: 4849688, groupName: "MOD" },
    { groupId: 5687123, groupName: "TFOC" },
    { groupId: 4849673, groupName: "Congress" },
    { groupId: 4800484, groupName: "The Soviet Union" },
    { groupId: 4948472, groupName: "5th" },
  ];

async function getTSUGroup(username) {
    const { userId } = await getRobloxProfile(username);

    let rankPromises = rankInfo.map(async (group) => {
        const rankName = await noblox.getRankNameInGroup(
          group.groupId,
          userId
        );

        if (rankName && rankName !== "Guest") {
          return `${group.groupName} ${rankName}`;
        
        }
        return null;
      });

      let ranks = await Promise.all(rankPromises);
      ranks = ranks.filter((rank) => rank !== null);
      let formatedRank = `${ranks.join( " | " )}`
      
return { formatedRank }

}

module.exports = { getTSUGroup };