const { MessageEmbed } = require('discord.js');

const errorCount = {}; // Initialize empty object to track error counts

module.exports = (error = {}, message = {}) => {
  const errorMessage = new MessageEmbed()
    .setColor('DARK_RED')
    .setTitle('Error')
    .setDescription(`An error occurred: \`${error.message}\``)
    .setTimestamp()
    .setFooter({ text:`ERROR`,iconURL: 'https://cdn.discordapp.com/icons/1020893776413212723/1b93a370416ad036e1d386ccb04d7fb8.png?size=1024' });

  if (message.content) { // Check if message exists
    errorMessage.addField('Command', `\`${message.content}\``);
  }

  console.error(error);

  // Increment error count for this specific error message
  const errorMessageKey = error.message?.toLowerCase() || '';
  errorCount[errorMessageKey] = errorCount[errorMessageKey] ? errorCount[errorMessageKey] + 1 : 1;

  // Append error count to description field
  errorMessage.setDescription(`${errorMessage.description} This error has occurred ${errorCount[errorMessageKey]} time(s) after restart.`);

  const channel = message.client?.channels?.cache.get('1089981979254079500'); // Change channel Id
  if (channel) {
    channel.send({ embeds: [errorMessage] })
      .catch(console.error);
  }
}
// 1081956241082957964