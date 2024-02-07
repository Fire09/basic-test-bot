const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');

const dailyAmount = 100;

module.exports = {
  name: 'daily',
  description: 'Collect your daily coins!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside the server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected your daily coins today. Come back tomorrow!'
          );
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}` // Feel free to add an emoji for the coin
      );
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};
