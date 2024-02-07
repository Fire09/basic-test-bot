const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'botinfo',
  description: 'Shows info about HARPBot',

  callback: (client, interaction) => {
    const embed = {
      title: 'HARP Bot Info',
      description: 'A Bot Created By WastedLight',
      fields: [
        {
          name: 'Creator',
          value: 'WastedLight',
          inline: true,
        },
        {
          name: 'Version',
          value: '1.0',
          inline: true,
        },
        {
          name: 'Date created',
          value: `July 27, 2023`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: formatUptime(client.uptime),
          inline: true,
        },
      ],
      color: 4187121,
      thumbnail: {
        url: 'https://cdn.discordapp.com/attachments/864778098737020951/1134050170993119272/image.png',
      },
      footer: {
        text: 'Basic Test Bot- Created by WastedLight',
        icon_url: 'https://cdn.discordapp.com/attachments/864778098737020951/1134050170993119272/image.png',
      },
      timestamp: new Date(),
    };

    interaction.reply({ embeds: [embed] });
  },
};

// Helper function to format uptime in HH:MM:SS format
function formatUptime(uptime) {
  const totalSeconds = Math.floor(uptime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}