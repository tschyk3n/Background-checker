const {MessageEmbed} = require("discord.js")


module.exports = (title, description, color, commandName) => {
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title || 'Untitled')
    .setDescription(description || 'No description provided.')
    .setTimestamp()
    .setFooter({ text:`The Jedi Order`,iconURL: 'https://tr.rbxcdn.com/bb1ddf1e68f3a667886710bb086c768f/150/150/Image/Png' });

  if (!embed.description) {
    embed.setDescription('_ _'); // Add a blank field if description is empty
  }

  return embed;
};
