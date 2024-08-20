const fs = require('fs');

function sendChangesOfMembers(groupMembers, groupInfo) {
  const currentTime = new Date().toLocaleString();

  let jsonContent = [];
  try {
    const fileData = fs.readFileSync('Config/109thMembers.json', 'utf-8');
    if (fileData) {
      jsonContent = JSON.parse(fileData);
    }
  } catch (error) {
    console.log('Error reading or parsing the JSON file:', error);
    return;
  }

  for (const member of jsonContent) {
    const userId = member.robloxId;

    const groupMember = groupMembers.find((m) => m.user.userId === userId);

    if (!groupMember) {
      console.log(`${member.username} has left ${member.groupName} and was the rank ${member.currentRobloxGroupRank}`);
    } else if (groupMember.role.rank !== member.currentRobloxGroupRank) {
      console.log(`${member.username} has a new rank ${groupMember.role.rank} and was ${member.currentRobloxGroupRank}`);
      member.currentRobloxGroupRank = groupMember.role.rank;
    }
  }

  for (const groupMember of groupMembers) {
    const userId = groupMember.user.userId;

    const existingMember = jsonContent.find((m) => m.robloxId === userId);

    if (!existingMember) {
      console.log(`${groupMember.user.username} has joined the group and is now ${groupMember.role.name}`);
      jsonContent.push({
        username: groupMember.user.username,
        robloxId: userId,
        currentRobloxGroupRank: groupMember.role.rank,
        groupid: groupInfo.groupId,
        groupName: groupInfo.groupName
      });
    }
  }

  console.log('Data to be saved:', jsonContent);

  try {
    fs.writeFileSync('Config/109thMembers.json', JSON.stringify(jsonContent, null, 2));
    console.log('Data saved to JSON file successfully.');
  } catch (error) {
    console.log('Error writing to the JSON file:', error);
  }
}

module.exports = sendChangesOfMembers;