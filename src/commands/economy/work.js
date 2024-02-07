const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User'); // Assuming you have the User model defined correctly

module.exports = {
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    try {
      const userId = interaction.member.id;
      const guildId = interaction.guild.id;

      // Fetch the user's data from the database
      const user = await User.findOne({ userId, guildId });

      if (!user) {
        interaction.editReply("You don't have a user entry.");
        return;
      }

      const lastWorkedAt = user.lastWorkedAt || 0;
      const cooldown = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

      const currentTime = Date.now();
      const timeSinceLastWork = currentTime - lastWorkedAt;

      if (timeSinceLastWork < cooldown) {
        const timeRemaining = cooldown - timeSinceLastWork;
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));

        interaction.editReply(`You can work again in ${hoursRemaining} hours.`);
        return;
      }

      // Define available jobs or work options with corresponding coin rewards
      const workOptions = [
        { job: 'Discord Mod', reward: 50 },
        { job: 'Computer Scientist', reward: 250 },
        { job: 'Developer', reward: 500 },
      ];

      // Randomly select a job from the available options
      const randomIndex = Math.floor(Math.random() * workOptions.length);
      const selectedJob = workOptions[randomIndex];

      // Calculate the new balance after earning the reward
      const newBalance = user.balance + selectedJob.reward;

      // Update the user's balance and last worked timestamp in the database
      user.balance = newBalance;
      user.lastWorkedAt = currentTime;
      await user.save();

      interaction.editReply(`You worked as ${selectedJob.job} and earned ${selectedJob.reward} . Your new balance is ${newBalance} <:beecoin:1135256384720609443>.`); // this is how youd add the emoji but please change it
    } catch (error) {
      console.error('Error running work command:', error);
      interaction.editReply('An error occurred while running the command.');
    }
  },

  name: 'work',
  description: 'Work and earn Coins based on your job or role!',
};
