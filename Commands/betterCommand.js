const errorHandling = require("../Functions/error_handler.js");
const Discord = require("discord.js");

// Import the getRobloxProfile and getGroupAndBadges functions
const { getRobloxProfile } = require("../Functions/getInformation");
const { getGroupAndBadges } = require("../Functions/getBadgesAndGroup");
const { getBlacklist } = require("../Functions/getBlacklist");
const { getTSUGroup } = require("../Functions/getTSUGroups");
const { getRaiderGroup } = require("../Functions/getRaiderGroups");
const { getClothingInfo } = require("../Functions/getClothing");
const { getSusFriends } = require("../Functions/getSuspiciousFriends.js");
const { getSusFollowing } = require("../Functions/getSuspiciousFollowings.js");
const { getSusFollower } = require("../Functions/getSuspiciousFollowers.js");

module.exports = {
  name: "better",
  description: "better",
  async execute(message, args, client) {
    console.log("Running");
    if (args[0]) {
        const username = args[0];
        message.reply("maggot working..")
      try {
        const profileInfo = await getRobloxProfile(username);
        const badgeGroupResult = await getGroupAndBadges(username);
        const blacklistInfo = await getBlacklist(username)
        const TSUGroupInfo = await getTSUGroup(username)
        const raiderGroupInfo = await getRaiderGroup(username)
        const clothingInfo = await getClothingInfo(username);
        const weirdFriends = await getSusFriends(username)
        const weirdFollowings = await getSusFollowing(username)
        const weirdFollowers = await getSusFollower(username)
        let embed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("User Information")
          .setDescription("Displaying information about the user")
          .addField("Discord Information", "Discord Username:\nDiscord ID:\nDiscord Age:\nServer Join Date (TSU):\nChat Messages")
          .addField(
            "Roblox Information",
            `Username: ${username}\nRoblox Join Date: ${profileInfo.robloxJoinDate} days\nFriends: ${profileInfo.friendsCount}\nPrevious name(s): ${profileInfo.previousNames}\nBlacklists: ${blacklistInfo.blacklists}\n\nAccount link: https://www.roblox.com/users/${profileInfo.userId}/profile\nAmount of badges: ${badgeGroupResult.amountBadges} badges and ${badgeGroupResult.susBadges} are fake/spam/suspicious badges\nAmount of groups: ${badgeGroupResult.amountGroup} groups\nTSU Ranks: ${TSUGroupInfo.formatedRank}\nBanned/CBanned:`
          )
          .addField(
            "Associations",
            `Suspicious Friends: ${weirdFriends.join('\n')} \nSuspicious Followers: ${weirdFollowers.join('\n')}\nSuspicious Following: ${weirdFollowings.join('\n')}\nSuspicious Groups: ${raiderGroupInfo.formatedRank}\nAffliated Raider Content: ${clothingInfo.links}`
          )
          .addField("Pass/Denied", "No idea");

        message.reply({ embeds: [embed] });
      } catch (error) {
        console.error("Error occurred during command execution:", error);
        // Handle the error using your error handling function
        errorHandling(error, message);
      }
    }
  },
};