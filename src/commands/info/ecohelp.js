module.exports = {
    name: 'ecohelp',
    description: 'economy help',
  
    callback: (client, interaction) => {
      const embed = {
        title: 'Economy Commands Help For Basic Test Bot',
        description: 'Here are the available economy commands:',
        fields: [
          {
            name: '/level',
            value: 'Get your current level',
          },
          {
            name: '/leaderboard',
            value: 'The top 10 members with the most level XP!',
          },
          {
            name: '/balance',
            value: 'Check your current balance of currency',
          },
          {
            name: '/beg',
            value: 'beg for more Coins!',
          },
          {
            name: '/daily',
            value: 'Get your Coins each day!',
          },
          {
            name: '/work',
            value: 'Use this slash command for more Coins!',
          },
          {
            name: '/buy',
            value: 'Want to spend your Coins on something cool? Do /buy to get something!',
          },
          {
            name: '/shop',
            value: 'Shows all availible products in stock at HARP SHOP!',
          },
          {
            name: '/inventory',
            value: 'Shows every thing you brought/own from the shop!',
          },
        ],
        color: 4187121, // You can customize the color as desired
        image: {
          url: 'https://cdn.discordapp.com/attachments/864778098737020951/1134050170993119272/image.png',
      },
    };
  
      interaction.reply({ embeds: [embed] });
    },
  };