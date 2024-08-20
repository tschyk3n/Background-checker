require('dotenv').config(); // Load .env file
const fs = require('fs');
const { Client, Intents, MessageEmbed, Collection  } = require('discord.js');
const errorHandler = require('./Functions/error_handler');
const makeEmbed = require("./Functions/embed")
const cooldowns = new Collection();
const noblox = require("noblox.js")
const settings = require('./Config/settings.json');
const axios = require("axios")
const mongoose = require('mongoose');
const path = require('path');


// Create a new Client instance with intents
const client = new Client({ 
  intents: [ 
      Intents.FLAGS.GUILDS, 
      Intents.FLAGS.GUILD_MESSAGES ,
      Intents.FLAGS.DIRECT_MESSAGES
  ] 
});




const normalGroupInfo = [
  { groupId: 17231392, groupName: 'Delta Squad', channelId: '1119296311867473920' },
  { groupId: 17202621, groupName: 'Charlie Squad', channelId: '1119296281442005002' },
  { groupId: 16428908, groupName: 'Bravo Squad', channelId: '1119296246113386506' },
  { groupId: 16553831, groupName: '109th Machinery', channelId: '1119296197635616849' },
  { groupId: 32032445, groupName: 'Foxtrot Squad', channelId: '1119296066156769310' },
  { groupId: 5902649, groupName: '109th', channelId: '1119295990286000269' },
  { groupId: 16909177, groupName: 'Echo Squad', channelId: '1119296110830309376' },
  { groupId: 16467057, groupName: 'Soviet Βorder Τrooper', channelId: '1119296353818919033' },
  { groupId: 13300850, groupName: 'Army Education and Enrollment Command', channelId: '1119296424182558821' },
  { groupId: 5737557, groupName: 'Camouflaged Reconnaissance Unit', channelId: '1119296457678278677' },
  { groupId: 5687123, groupName: 'The Facility Operations Command', channelId: '1119296488175046667' },
  { groupId: 4948472, groupName: 'The 5th Rifle Division', channelId: '1119296534450802719' },
  { groupId: 4808054, groupName: 'Spetsnaz .' , channelId: '1119296583339614269' }, 
  { groupId: 4805092, groupName: 'The Committee for State Security .', channelId: '1119296643968282664' },
  { groupId: 4805062, groupName: 'The Red Guard .', channelId: '1119296676075671683' }, 
  { groupId: 4809040, groupName: 'Officers Academy .', channelId: '1119296708027883563' },
  { groupId: 4291835, groupName: 'Phoenix', channelId: '1119296744480583691' },
  { groupId: 5855498, groupName: 'The Soviet Media', channelId: '1119296773811351664' },
  { groupId: 5117666, groupName: 'Biopreparat', channelId: '1119296811358761061' },
  { groupId: 4849688, groupName: 'Ministry of Defense .', channelId: '1119296840848908431' },
  { groupId: 6018695, groupName: 'OMON .', channelId: '1119296870238404740' },  
  { groupId: 11934361, groupName: 'Militsiya Detective Division', channelId: '1119296896129835201' },

];

const getGroupMembers = async (groupId) => {

  

  let members = [];
  let nextCursor = '';

  do {
    const response = await axios.get(`https://groups.roblox.com/v1/groups/${groupId}/users?limit=100${nextCursor === '' ? '' : '&cursor=' + nextCursor}&sortOrder=Asc`);
    const data = response.data;

    members = members.concat(data.data.map((member) => ({
      groupId,
      groupName: normalGroupInfo.find((group) => group.groupId === groupId).groupName,
      username: member.user.username,
      userId: member.user.userId,
      rankName: member.role.name,
    })));

    if (data.nextPageCursor) {
      nextCursor = data.nextPageCursor;
    } else {
      nextCursor = '';
    }
  } while (nextCursor !== '');

  return members;
};

const filePath = path.join(__dirname, 'Config', '109thMembers.json');

const saveToJsonFile = (data, filePath) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
};

const getAllGroupMembers = async () => {
  let existingMembers = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
  const addedMembers = [];
  const removedMembers = [];
  const updatedMembers = [];
  let hasChanges = false;

  const groupChannelMap = {};
  for (const group of normalGroupInfo) {
    groupChannelMap[group.groupId] = group.channelId;
  }

  for (const group of normalGroupInfo) {
    const members = await getGroupMembers(group.groupId);
    const existingMembersInGroup = existingMembers.filter((member) => member.groupId === group.groupId);

    for (const member of members) {
      const isExisting = existingMembersInGroup.some((existingMember) => existingMember.userId === member.userId);

      if (!isExisting) {
        addedMembers.push({
          userId: member.userId,
          username: member.username,
          group: member.groupName,
        });
        existingMembers.push(member);
        hasChanges = true;
        const channelId = groupChannelMap[group.groupId];
        sendLogMessage(member, `**joined** and is the rank **${member.rankName}** in the group`, channelId);
      } else {
        const existingMember = existingMembers.find((existing) => existing.userId === member.userId && existing.groupId === member.groupId);
        if (existingMember.rankName !== member.rankName) {
          const oldRank = existingMember.rankName; // Retrieve the old rank
          existingMember.rankName = member.rankName;
          updatedMembers.push({
            userId: member.userId,
            username: member.username,
            group: member.groupName,
            oldRank: oldRank, // Use the retrieved old rank
            newRank: member.rankName,
          });
          hasChanges = true;
          const channelId = groupChannelMap[group.groupId];
          sendLogMessage(member, `rank has changed from **${oldRank}** to **${member.rankName}** in the group`, channelId);
        }
      }
    }

    for (const existingMember of existingMembersInGroup) {
      const isStillInGroup = members.some((member) => member.userId === existingMember.userId);
    
      if (!isStillInGroup) {
        removedMembers.push({
          userId: existingMember.userId,
          username: existingMember.username,
          group: existingMember.groupName,
          rank: existingMember.rankName,
        });
        existingMembers = existingMembers.filter((member) => member.userId !== existingMember.userId || member.groupId !== existingMember.groupId);
        hasChanges = true;
        const channelId = groupChannelMap[group.groupId];
        sendLogMessage(existingMember, `**discharged**/ was **exiled** and was the rank **${existingMember.rankName}** in the group`, channelId);
      }
    }
  }

  if (hasChanges) {
    if (addedMembers.length > 0) {
      console.log('Added Members:');
      addedMembers.forEach((member) => {
        console.log(`[${member.username}] (${member.userId}) joined [${member.group}] and is the rank [${member.rank}]`);
      });
    }

    if (removedMembers.length > 0) {
      console.log('Removed Members:');
      removedMembers.forEach((member) => {
        console.log(`[${member.username}] (${member.userId}) discharged/was exiled from [${member.group}] and was the rank [${member.rank}]`);
      });
    }

    if (updatedMembers.length > 0) {
      console.log('Updated Members:');
      updatedMembers.forEach((member) => {
        console.log(`[${member.username}] (${member.userId}) has a new rank [${member.oldRank}] (wrong) -> [${member.newRank}] in [${member.group}]`);
      });
    }

    setTimeout(() => {
      saveToJsonFile(existingMembers, filePath);
    },2 * 60 * 1000); // 2 * 60 * 1000
  } else {
    console.log('No changes. Nothing added, removed, or updated in the JSON file.');
  }
};

const sendLogMessage = (member, action, channelId) => {
  let color;

  if (action.includes('exiled') || action.includes('discharged')) {
    color = '#960a00'; // Red color for exiled/discharged
  } else if (action.includes('new')) {
    color = '#eac802'; // Yellow color for rank updated
  } else {
    color = '#55af17'; // Green color for group joined
  }

  const embed = new MessageEmbed()
    .setTitle('Changes have been made!')
    .setDescription(`**${member.username}** (${member.userId}) ${action}`)
    .setColor(color)
    .setTimestamp();

  client.channels
    .fetch(channelId)
    .then((channel) => {
      if (channel.isText()) {
        channel
          .send({ embeds: [embed] })
          .catch((error) => {
            console.error('Failed to send message:', error);
          });
      } else {
        console.error(`Channel with ID ${channelId} is not a text channel.`);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch channel:', error);
    });
};


  getAllGroupMembers();
setInterval(getAllGroupMembers, 5 * 60 * 1000);





// Load all event files in the events folder
const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./Events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Load commands and prefix
client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));

const { prefix } = require('./Config/config.json');

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
});




client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    if (commandName === '') return;
  
    const command = client.commands.get(commandName);
  
    // If the command does not exist
    if (!command) {
      const errorMessage =  makeEmbed("Command not found!", `The command \`${commandName}\` does not exist.`, "DARK_RED", "Error")
      message.reply({ embeds: [errorMessage] })
      .then((msg) => {
        // Delete the error message after 10 seconds
        setTimeout(() => {
            msg.delete();
        }, 10000);
      })
    } else {
   // cooldown Duration
const nowTime = Date.now();
const timestamps = cooldowns.has(command.name) ? cooldowns.get(command.name) : new Collection();
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (nowTime < expirationTime) {
        const timeLeft = (expirationTime - nowTime) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        .then((msg) => {
          // Delete the error message after 10 seconds
          setTimeout(() => {
              msg.delete();
          }, 10000);
        })
    }
}

timestamps.set(message.author.id, nowTime);
cooldowns.set(command.name, timestamps);


try{
 
    command.execute(message, args)
    } catch (error) {
      errorHandler(error, message);
      // Send error message
      let errorEmbed = makeEmbed('An error occurred!', `Seems like an error occurred while trying to use \`${commandName}\`. Developers have been contacted.`, 'DARK_RED');
      message.reply({ embeds: [errorEmbed] });
    
    }
    }
    
  })



  

















client.login(process.env.TOKEN); // Login with token from .env file