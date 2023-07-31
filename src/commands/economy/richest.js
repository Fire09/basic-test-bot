const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

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
      // Fetch all members in the guild to ensure the cache is populated
      await interaction.guild.members.fetch();

      const topRichestUsers = await User.find({ guildId: interaction.guild.id })
        .select('userId balance')
        .sort({ balance: -1 })
        .limit(10);

      if (!topRichestUsers.length) {
        interaction.editReply('No data available.');
        return;
      }

      const leaderboard = topRichestUsers.map((userData, index) => {
        const user = interaction.guild.members.cache.get(userData.userId);
        return `${index + 1}. ${user ? user.user.tag : 'Unknown User'} - Balance: ${userData.balance}`;
      });

      const embed = {
        color: 4187121, // Brown color
        title: '💰🪙`Top 10 Richest Users in this Server `🪙💰:',
        description: leaderboard.join('\n'),
      };

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving the richest users:', error);
      interaction.editReply('An error occurred while retrieving the richest users.');
    }
  },

  name: 'richest',
  description: 'Shows the top 10 richest users in the server.',
};
