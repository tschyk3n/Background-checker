const axios = require('axios');

async function getGroupMembers(groupId, nextCursor = '') {
  let members = [];

  do {
    const response = await axios.get(`https://groups.roblox.com/v1/groups/${groupId}/users?limit=100${nextCursor === '' ? '' : '&cursor=' + nextCursor}&sortOrder=Asc`);
    const data = response.data;

    members = members.concat(data.data);

    if (data.nextPageCursor) {
      nextCursor = data.nextPageCursor;
    } else {
      nextCursor = '';
    }
  } while (nextCursor !== '');

  return members;
}

module.exports = getGroupMembers;
