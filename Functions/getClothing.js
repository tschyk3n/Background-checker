const { getRobloxProfile } = require("../Functions/getInformation");
const axios = require("axios");

async function getClothingInfo(username) {
  const { userId } = await getRobloxProfile(username);

  let nextCursor = "yes";
  let hasPublicInventory = true;
  let inventory = [];
  let current = 0;
  let limit = 100;

  const assetIds = [
    6557844988, 6145630130, 6456001810, 6145603339, 6145062585, 6456006402,
    6145060863, 6557849665, 6121932479, 7772636376, 7772624807, 7772623442,
    7772621068, 7772619003, 7772611327, 7790943732, 7795200832, 5824481123,
    6520130517, 6011152129, 5880737458, 5533533246, 5196400791, 5047308146,
    5031841207, 6520131411, 6011153713, 5880742473, 5612459187, 5533535061,
    5050174545, 5196401993, 5955609562, 6064847250, 5635901375, 5062358807,
    5031963971, 6967076952, 6967073061, 8388851136, 8159890554, 7371148872,
    6435247571, 8388857822, 6435254871, 8159677461, 7371151829, 5921705140,
    5921706323, 7310695884, 7078841685, 6473207706, 6473217584, 7078846374,
    7316456767, 7333281002, 7215824415, 7215907423, 7215840720, 7333217612,
    6695022734, 6694826391, 5693771658, 5492795384, 6694827987, 5693772376,
    5492796328, 6165960623, 6080735759, 5733263443, 8771172193, 8771182712,
    7062500052, 6759486939, 6598154622, 6455422355, 6598159462, 6404987590,
    6031363315, 5646493459, 5646494481, 5809929449, 5646502856, 5822986922,
    5823513582, 5019082284, 5019085927, 6230086835, 5594417678, 5247095728,
    6230450406, 5594418266, 5247096613, 8508664185, 8229836402, 7370369620,
    7163333714, 7118681214, 7118711216, 4230886156, 8502885698, 6706863085,
    6703312042, 6677027667, 6706865482, 6677049036, 6703318037, 6331710433,
    6213782374, 6223534670,
  ];
  try {
    do {
      const response = await axios.get(
        `https://inventory.roblox.com/v2/users/${userId}/inventory?assetTypes=TShirt%2C,Pants%2CShirt&limit=100${
          nextCursor === "yes" ? "" : "&cursor=" + nextCursor
        }&sortOrder=Asc`
      );
      nextCursor = response?.data?.nextPageCursor;
      if (hasPublicInventory) {
        inventory.push(...response.data.data);
      }

      current++;
    } while (nextCursor && limit >= current);

    // Check if the user's assets have any matching IDs
    const matchedAssets = inventory.filter(asset => assetIds.includes(asset.assetId));

    if (matchedAssets.length > 0) {
      // Get the names and links of the matched assets
      const assetNames = matchedAssets.map(asset => asset.name);
      const assetLinks = matchedAssets.map(asset => `https://www.roblox.com/catalog/${asset.assetId}`);

      return { names: assetNames, links: assetLinks };
    } else {
      return "Found no raider assets" // Return a single item array with the message
    }

  } catch (error) {
    console.error("Error retrieving asset info:", error);
    return null;
  }
}

module.exports = { getClothingInfo };
