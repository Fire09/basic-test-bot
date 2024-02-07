const { Client, Interaction } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const User = require('../../models/User');

module.exports = {
  name: 'profile',
  description: 'Shows your HARP economy profile or account!',

  callback: async (client, interaction) => {
    const targetUser = interaction.user;
    const avatarURL = targetUser.displayAvatarURL({ dynamic: true });

    try {
      // Fetch level data from database
      const fetchedLevel = await Level.findOne({
        userId: targetUser.id,
        guildId: interaction.guild.id,
      });

      if (!fetchedLevel) {
        interaction.reply(`You don't have a level yet.`);
        return;
      }

      // Fetch user data from the database
      const fetchedUser = await User.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

      const level = fetchedLevel.level;
      const xp = fetchedLevel.xp;
      const requiredXp = calculateLevelXp(level);
      const balance = fetchedUser ? fetchedUser.balance : 0;

      // Create buttons for each piece of information
      const levelButton = {
        type: 2,
        style: 1,
        label: 'Level',
        customId: 'level',
      };

      const xpButton = {
        type: 2,
        style: 1,
        label: 'XP',
        customId: 'xp',
      };

      const balanceButton = {
        type: 2,
        style: 1,
        label: 'Balance',
        customId: 'balance',
      };

      const fullProfileButton = {
        type: 2,
        style: 1,
        label: 'Full Profile',
        customId: 'full_profile',
      };

      // Create an action row with the buttons
      const actionRow = {
        type: 1,
        components: [levelButton, xpButton, balanceButton, fullProfileButton],
      };

      // Send the initial message with the action row
      await interaction.reply({
        content: 'Please select an option to view:',
        embeds: [
          {
            title: `Profile of ${targetUser.username}`,
            description: `Level: ${level}\nXP: ${xp}/${requiredXp}\nBalance: ${balance}`,
            color: 4187121,
            image: {
              url: avatarURL,
            },
          },
        ],
        components: [actionRow],
      });

      const filter = (buttonInteraction) =>
        buttonInteraction.user.id === interaction.user.id && buttonInteraction.isButton() && actionRow.components.some((button) => button.customId === buttonInteraction.customId);

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on('collect', async (buttonInteraction) => {
        let embedDescription = '';

        // Handle button interactions based on the selected option
        switch (buttonInteraction.customId) {
          case 'level':
            embedDescription = `**Level:** ${level}`;
            break;
          case 'xp':
            embedDescription = `**XP:** ${xp}/${requiredXp}`;
            break;
          case 'balance':
            embedDescription = `**Balance:** ${balance}`;
            break;
          case 'full_profile':
            embedDescription = `**Full Profile of ${targetUser.username}**\n\n**Level:** ${level}\n**XP:** ${xp}/${requiredXp}\n**Balance:** ${balance}`;
            break;
        }

        // Create the embed
        const embed = {
          title: `Profile of ${targetUser.username}`,
          description: embedDescription,
          color: 0x964B00,
          image: {
            url: avatarURL,
          },
        };

        // Update the message with the selected information
        await buttonInteraction.update({
          embeds: [embed],
          components: [actionRow], // Re-add the action row to the updated message
        });
      });

      collector.on('end', () => {
        interaction.followUp('The menu has closed.');
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      interaction.reply('An error occurred while fetching your profile.');
    }
  },
};
