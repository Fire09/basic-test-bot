const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const sidesOption = interaction.options.get('sides');
      const sides = sidesOption ? sidesOption.value : 6; // Default to 6 sides if not provided

      // Roll the dice
      const result = Math.floor(Math.random() * sides) + 1;

      interaction.editReply(`You rolled a ${result} on a ${sides}-sided dice!`);
    } catch (error) {
      console.error('Error running roll command:', error);
      interaction.editReply('An error occurred while running the command.');
    }
  },

  name: 'rolldice',
  description: 'Roll a dice.',
  options: [
    {
      name: 'sides',
      description: 'Number of sides on the dice (default: 6).',
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
};
