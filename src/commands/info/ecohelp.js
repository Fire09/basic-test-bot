module.exports = {
    name: 'ecohelp',
    description: 'economy help',
  
    callback: (client, interaction) => {
      const embed = {
        title: 'Economy Commands Help For Bot',
        description: 'Here are the available economy commands:',
        fields: [
          {
            name: '/level',
            value: 'Get your current level',
          },
          {
            name: '/richest',
            value: 'Shows richest in the server!',
          },
          {
            name: '/balance',
            value: 'Check your current balance of currency',
          },
          {
            name: '/daily',
            value: 'Get your Coins each day!',
          },
        ],
        color: 4187121, // You can customize the color as desired
        image: {
          url: '', // put your image here
      },
    };
  
      interaction.reply({ embeds: [embed] });
    },
  };