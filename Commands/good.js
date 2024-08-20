const makeEmbed = require("../Functions/embed");
const { Collection, MessageEmbed } = require("discord.js");
const noblox = require("noblox.js");
const axios = require("axios");

module.exports = {
  name: "ss",
  description: "Checks if the APIs are still available.",
  async execute(message, args, client) {
    const raidingGroupInfo = [
      { groupId: 8675204, groupName: "[TDR] The Dark Resistance" },
      { groupId: 7033913, groupName: "Order of The Ninth's Revenge" },
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
    async function fetchGroupMembers(groupId) {
      let members = [];
      let nextCursor = '';
    
      do {
        const response = await axios.get(
          `https://groups.roblox.com/v1/groups/${groupId}/users?limit=100${
            nextCursor === '' ? '' : '&cursor=' + nextCursor
          }&sortOrder=Asc`
        );
    
        const data = response.data;
        members = members.concat(data.data);
    
        if (data.nextPageCursor) {
          nextCursor = data.nextPageCursor;
        } else {
          nextCursor = '';
        }
      } while (nextCursor !== '');
    
      return members;
    }
    
    async function fetchAllGroupMembers() {
      for (const group of raidingGroupInfo) {
        const groupId = group.groupId;
        const groupName = group.groupName;
    
        console.log(`Fetching members of group: ${groupName}`);
    
        const members = await fetchGroupMembers(groupId);
    
        // Do something with the members
        console.log(members);
    
        // Save the members in a variable or process them further
        // Save the 'members' variable to a file, database, or perform any desired operations
    
        console.log(`Fetched ${members.length} members for group: ${groupName}`);
      }
    }
    
    // Call the function to start fetching members for all groups
    fetchAllGroupMembers();

  }
};