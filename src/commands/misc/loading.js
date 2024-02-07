const Level = require('../../models/Level');

module.exports = {
  name: 'load',
  description: 'Loading a secret surprise :D!',
  callback: async (client, interaction) => {
    await interaction.reply('Loading...').then(async (loadingMessage) => {
      const spinner = ['◜', '◠', '◝', '◞', '◡', '◟'];
      let index = 0;

      const updateLoader = (progress) => {
        const progressBar = '■'.repeat(Math.floor(progress / 10)) + '□'.repeat(10 - Math.floor(progress / 10));
        const updatedMessage = `Loading... ${progress}% ${progressBar} ${spinner[index]}`;
        loadingMessage.edit(updatedMessage);
        index = (index + 1) % spinner.length;
      };

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          updateLoader(progress);
        } else {
          clearInterval(interval);

          // Generate a random amount of XP between 10 and 50
          const xpEarned = Math.floor(Math.random() * 41) + 10;

          // Get the user's ID from the interaction
          const userId = interaction.user.id;

          // Update the user's XP in the database
          Level.findOneAndUpdate({ userId }, { $inc: { xp: xpEarned } }, { upsert: true })
            .then(() => {
              const resultMessage = `Loading complete! Enjoy! Here is your secret surprise: You earned ${xpEarned} XP! SUIIIIII `;
              interaction.editReply(resultMessage);
            })
            .catch((error) => {
              console.error(error);
              interaction.editReply('An error occurred while updating XP.');
            });
        }
      }, 500);
    });
  },
};
