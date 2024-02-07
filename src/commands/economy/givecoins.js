const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User'); // Assuming you have a User model defined

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    // Check if the user executing the command has the necessary permissions
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      interaction.reply('You do not have the required permissions to use this command.');
      return;
    }

    await interaction.deferReply();

    try {
      const mentionedUserId = interaction.options.get('target-user')?.value;
      const targetUserId = mentionedUserId || interaction.member.id;

      const coinsToAdd = interaction.options.get('amount')?.value || 0;

      const guildId = interaction.guild.id;

      // Find the user in the database
      let user = await User.findOne({ userId: targetUserId, guildId });

      // If user doesn't exist, create a new entry for them.
      if (!user) {
        user = new User({
          userId: targetUserId,
          guildId,
          balance: 0, // Assuming you have a field called 'balance' in the User model
        });
      }

      user.balance += coinsToAdd;

      await user.save();

      interaction.editReply(`Added ${coinsToAdd} coins to <@${targetUserId}>'s balance.`);
    } catch (error) {
      console.error('Error running give-coins command:', error);
      interaction.editReply('An error occurred while running the command.');
    }
  },

  name: 'give-coins',
  description: 'Give coins (XP) to a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user to give coins (XP) to.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of coins (XP) to give.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
