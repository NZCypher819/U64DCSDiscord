# U64-DCS-DiscordBot
A Discord bot installed on a server you want to be able to manage the apps on. This bot is targetted at Windows and primarily DCS servers and their functions. 

Setup a DCS Dedicated Server Guide can be found [here]()

Set the configuration settings at the top of the u64-dcs-discordbot.js file and run in Node JS. 

The bot also has a autodelete feature as well, which will delete messages in the target discord channel after a preset time. This autodelete time is configurable.

# Bot Access Token
You need a discord App and Bot which you can create a new bot and get the token by following these steps:

    1. Go to the Discord Developer Portal (https://discord.com/developers/applications)
    2. Log in with your Discord account
    3. Click on "New Application"
    4. Give your application a name, and then select "Create"
    5. On the left sidebar, select "Bot"
    6. Click on "Add Bot"
    
    A token will be generated for your bot, keep this token safe and never share it out.

# Bot Permissions
Here are the specific permissions that the bot needs on the Management CHANNEL only (ie dont allow these permissions anywhere else):

    Read Messages: The bot needs this permission to read messages in the channel and look for the issuing of commands.
    Send Messages: The bot needs this permission to send messages in the channel otherwise you wont get feedback.
    Manage Messages: The bot needs this permission to delete messages in the channel.

# Running the Bot on Windows
Easier than pudding pie.... whatever that is...

install node js then open powershell and run the below npm installs from the directory you want to run the bot from. 

Need to install the following modules

    npm install request
    npm install discord.js

Once you have done that, open the config.js file and make your installation specific changes in there. Then open powershell, navigate to the right folder and run 'node u64-dcs-discordbot.js

It should say its logged in and listening while in the channel you'll see a nice "U64" welcome. The bot is now active and watching. Execute !test servername to see if it works by typing that in the discord channel.

# Config.js file
Heres what the variables do:

    targetChannel: Discord Channel ID to listen to. Its normally a big a number
    botToken: This is the token you got from the Discord Developer Portal. 
    appservername: The Unique name of the server you want to manage. This not the actual server name its the name you use to reference it in the channel. 
    dcsmissionfolder: The folder where you want to upload .miz files to.
    defenderenable: 1 = Enable Defender Scan, 0 = Disable Defender Scan   
    autodeletetimer: Time in minutes to wait before deleting the message.
    superadmin: Discord User ID of the Super Admin. This is the only user that can execute the !tasklist command.
    dcsenabled: 1 = Enable DCS Commands, 0 = Disable DCS Commands

# App Setup 
Easy to do, just add as many of the apps you want but adding lines in the config.js file as per below. It appears that the appexec can be case-sensitive so make sure you match the case of the actual file. Also make sure the last App in the list doesnt have a comma at the end.

    apps: [
        {appname: "DCS", appexec: 'DCS.exe', path: 'bin\\', rootfolder: 'C:\\Program Files\\Eagle Dynamics\\DCS World OpenBeta Server\\', startup: 'DCS_updater.exe', update: 'DCS_updater.exe --quiet update @openbeta'}, 
        {appname: "SRS", appexec: "SR-Server.exe", path: '', rootfolder: 'C:\\Program Files\\DCS-SimpleRadio-Standalone\\', startup: '', update: ''},
        {appname: "Your App", appexec: "YourApp.exe", path: '', rootfolder: 'C:\\Program Files\\YourApp\\', startup: '', update: ''} 
    ]

Below is what each part of the above array does. 

        appname: the app name you will reference in the commands
        appexec: the executable file name. Ensure it matches the case of the actual file. Some querys appear case-sensitive.  
        path: Sometimes the root folder doesnt hold all the executables, so in the above example DCS.exe is actually in the bin folder. 
        rootfolder: Root folder of the app. 
        startup: Sometimes the startup file is different to the appexec. In the above example DCS_updater.exe is the startup file.
        update: Putting something in here enables a update script to be run. In the above example 'DCS_updater.exe --quiet update @openbeta' is the update command to run it in quiet mode.

# Logging
Logfiles are written to u64bot-date.log. And reside in the same directory as the main bot. Log files are suppose to rotate every day but if they dont then.... its to do with the way Node JS processes dates. Will fix later. 

# Bot Commands and what they do...
All the following commands need to be proceded by the server name listed in the config file. That way the bot knows who your talking too. 

### !start 'app' 'server'
This checks to see if App  is started, and if not, starts it. 

    !start srs u64dcs01

### !stop 'app' 'server'
This checks to see if App is running and if it is, stops it. It kills the process. This is not graceful.

    !stop srs u64dcs01

### !status 'app' 'server'
Looks to see if the app process is running in the tasklist. 

    !status srs u64dcs01

### !test 'server'
Looks to see if the bot is working. 

    !test u64dcs01

### !reboot 'server'
It executes a powershell command to restart the server.

    !reboot u64dcs01

### !upload 'server'
This uploads .miz files to the dcsmissionfolder and initiates a Microsoft Defender scan on the file (if enabled via config file). Only *.miz files are accepted. This is meant to be a DCS specific thing only but I'm sure someone will use it for something dodgy so its limited to .miz files at this point.

    With a attached file to the chat message : !upload u64dcs01

This feature will upload the file to the server but will NOT add it to mission list on the server. Thats a process that needs to be done manually at this point. So using the account the server has for DCS, login to the DCS website and add the mission from there. 

### !update 'app' 'server'
If the app has a updater labeled in the config file, then this command will execute it.

    !update dcs u64dcs01

### !updatestatus 'app' 'server'
Provides a simple yes or no if the updater for said app is running or not. 

    !updatestatus dcs u64dcs01

## Super Admin Commands
### !tasklist 'server'
This outputs the Tasklist of the servers console. Its a dianogostic tool only. 

    !tasklist u64dcs01

### !updatebot 'server' - Not yet implemented.
This task is still experimental, but should reach out to Github, and download the latest version of the bot, and run it. 

    !updatebot u64dcs01