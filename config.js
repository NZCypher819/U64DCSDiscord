// U64 DCS Discord Bot
// This is the config file for the bot. These variables are imported into the main script function.
//
// TargetChannel is the channel ID of the channel you want the bot to post in.
// BotToken is the token of the bot you want to use.
// Appservername is the unique name of the server you want to use. This way you can run multiple instances of the bot from the same channel.
// DCSmissionFolder is the location of the mission folders. This is for uploading mission files to the server. Note the double \\ in the path.
// DefenderEnable is whether or not you want to use Windows Defender to scan the files before uploading them. 1 = yes, 0 = no.
// AutoDeleteTimer is the amount of time in seconds you want the bot to wait before deleting the messages in the channel. Timer is minutes
// SuperAdmin is the Discord ID of the user you want to be able to use the !tasklist command.
// DCSEnabled is whether or not you want to use the DCS functionality of the bot. 1 = yes, 0 = no.    - This feature is not yet implemented.
// Apps is an array of objects that contain the information for each app you want to use. Add as many as you want but think about what would happen if someone got access to the discord channel without authorisation.
//
// Author: NZCypher819
// Github: https://github.com/NZCypher819/U64-DCS-DiscordBot

module.exports = {
    targetChannel: '', 
    botToken: '', 
    appservername: 'u64dcs01', 
    dcsmissionfolder: 'C:\\users\\Administrator\\Saved Games\\DCS.openbeta_server\\missions\\', 
    defenderenable: 1,   
    autodeletetimer: 1, 
    superadmin: '', 
    dcsenabled: 1,
    apps: [
        {appname: "DCS", appexec: 'DCS.exe', path: 'bin\\', rootfolder: 'C:\\Program Files\\Eagle Dynamics\\DCS World OpenBeta Server\\', startup: 'DCS_updater.exe', update: "DCS_updater.exe", updateargs: "--quiet update @openbeta"}, 
        {appname: "SRS", appexec: "SR-Server.exe", path: '', rootfolder: 'C:\\Program Files\\DCS-SimpleRadio-Standalone\\', startup: '', update: '', updateargs: ''},
    ]
};