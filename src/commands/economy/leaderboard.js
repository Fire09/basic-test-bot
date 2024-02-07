const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    try {
      const allLevels = await Level.find({ guildId: interaction.guild.id })
        .select('userId level xp')
        .sort({ level: -1, xp: -1 })
        .limit(10);

      if (allLevels.length === 0) {
        interaction.editReply('No leaderboard data available.');
        return;
      }

      const leaderboardEmbed = {
        color: 4187121, // Blue color
        title: '🔹`Leaderboard`🔹:',
        fields: [],
      };

      for (let i = 0; i < allLevels.length; i++) {
        const levelData = allLevels[i];
        const user = await interaction.guild.members.fetch(levelData.userId);

        leaderboardEmbed.fields.push({
          name: `${i + 1}. ${user.user.username}`,
          value: `Level: ${levelData.level} - XP: ${levelData.xp}`,
        });
      }

      interaction.editReply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.error('Error retrieving leaderboard:', error);
      interaction.editReply('An error occurred while retrieving the leaderboard.');
    }
  },

  name: 'leaderboard',
  description: 'Shows the leaderboard based on levels.',
};
