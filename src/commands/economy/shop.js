const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'shop',
  description: 'Displays the items available in the shop for users to purchase.',

  callback: (client, interaction) => {
    // Define the shop items with their names and prices
    const shopItems = [
      { name: 'Super Sword', price: 500 },
      { name: 'Magic Potion', price: 200 },
      { name: 'Legendary Shield', price: 1000 },
    ];

    // Manually create the shop embed
    const shopEmbed = {
      title: 'Welcome to the HARP Shop!',
      description: 'Here are the items available for purchase:',
      color: 4187121,
      fields: [],
    };

    // Add each shop item as a field in the embed
    shopItems.forEach((item) => {
      shopEmbed.fields.push({
        name: item.name,
        value: `Price: ${item.price} coins`,
        inline: true,
      });
    });

    // Send the shop embed as a reply
    interaction.reply({ embeds: [shopEmbed] });
  },
};
