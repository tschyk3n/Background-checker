const makeEmbed = require("../Functions/embed");
const { Collection, MessageEmbed } = require("discord.js");
const noblox = require("noblox.js");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

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

async function getGroupMembers(groupId) {
  try {
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

    return members.map((member) => member.user.userId);
  } catch (error) {
    console.error(`Error retrieving members for groupId ${groupId}:`, error);
    message.reply("error")
    return [];
  }
}
module.exports = {
  name: "addraiders",
  description: "addRaiders to a json file",
  async execute(message, args, client) {
    
    const raiders = [];

    for (const group of raidingGroupInfo) {
      const { groupId, groupName } = group;
      console.log(`Retrieving members for group: ${groupName}`);
      message.reply(`Retrieving members for group: ${groupName}`)

      const members = await getGroupMembers(groupId);
      raiders.push(...members);
    }

    const raidersData = JSON.stringify(raiders, null, 2);
    const filePath = path.join(__dirname, "../Config/raidingMembers.json");

    fs.writeFile(filePath, raidersData, (err) => {
      if (err) {
        console.error("Error saving raiders to JSON file:", err);
        message.reply("Error saving raiders to JSON file:")

        return;
      }
      message.reply("Raiders saved to Config/raiders.json")
      console.log("Raiders saved to Config/raiders.json");
    });
  },
};