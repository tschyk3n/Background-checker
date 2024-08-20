const noblox = require('noblox.js');
const axios = require('axios');
const { getRobloxProfile } = require("../Functions/getInformation");

async function getGroupAndBadges(username) {
  try {
    const { userId } = await getRobloxProfile(username);

    let hasPublicInventory = true;
    let nextCursor = "yes";
    let limit = 100;
    let badges = [];

    do {
      let request = await axios
        .get(
          `https://badges.roblox.com/v1/users/${userId}/badges?limit=${limit}${
            nextCursor === "yes" ? "" : "&cursor=" + nextCursor
          }&sortOrder=Asc`
        )
        .catch((e) => {
          hasPublicInventory = false;
          nextCursor = null;
        });

      nextCursor = request?.data?.nextPageCursor;

      if (hasPublicInventory) {
        badges.push(...request.data.data);
      }
    } while (nextCursor && badges.length < 2500);

    let groups = await noblox.getGroups(userId);
    let amountBadges = badges.length > 2500 ? '2500+' : badges.length;
    let amountGroup = groups.length;

    let specialBadges = [];
    let consecutiveWelcomeBadges = 0;
    let consecutiveNumberBadges = 0;
    let consecutiveStageBadges = 0;
    let previousBadgeName = "";
    let previousBadgeNumber = "";

    for (let i = 0; i < badges.length; i++) {
      let badge = badges[i];
      let badgeName = badge.name;

      if (
        badgeName.startsWith("Free badge") ||
        /^\d+$/.test(badgeName) ||
        badgeName.includes("stage")
      ) {
        specialBadges.push(badgeName);
      }

      if (badgeName.startsWith === "Welcome") {
        if (badgeName === previousBadgeName) {
          consecutiveWelcomeBadges++;
        } else {
          consecutiveWelcomeBadges = 1;
        }
      }

      if (/^\d+$/.test(badgeName)) {
        if (badgeName - previousBadgeNumber === 1) {
          consecutiveNumberBadges++;
        } else {
          consecutiveNumberBadges = 1;
        }
      }

      if (badgeName.includes("stage")) {
        if (badgeName === previousBadgeName) {
          consecutiveStageBadges++;
        } else {
          consecutiveStageBadges = 1;
        }
      }

      previousBadgeName = badgeName;
      previousBadgeNumber = badgeName;
    }

    let specialBadgeCount = specialBadges.length;
    let consecutiveWelcomeCount = consecutiveWelcomeBadges;
    let consecutiveNumberCount = consecutiveNumberBadges;
    let consecutiveStageCount = consecutiveStageBadges;
let susBadges = consecutiveWelcomeCount + consecutiveNumberCount + consecutiveStageCount + specialBadgeCount

console.log(susBadges)
    return {
      amountBadges,
      amountGroup,
      susBadges
    };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        amountBadges: "0 (Error Occurred)",
        amountGroup: "0 (Error Occurred)",
        specialBadgeCount: "0 (Error Occurred)",
        consecutiveWelcomeCount: "0 (Error Occurred)",
        consecutiveNumberCount: "0 (Error Occurred)",
        consecutiveStageCount: "0 (Error Occurred)"
      };
    }
  }
}

module.exports = { getGroupAndBadges };