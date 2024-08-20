const noblox = require('noblox.js');
async function startApp () {

const currentUser = await noblox.setCookie(process.env.ROBLOX_COOKIE)
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)

}
startApp()