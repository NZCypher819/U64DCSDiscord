// U64 DCS Discord Bot
// This bot is used for managing Apps on a server from Discord. Its primary usage is targetted at Windows OS and DCS
//
// Config information is located in the config.js script. 
//
// Author: NZCypher819
// Github: https://github.com/NZCypher819/U64-DCS-DiscordBot

global.socket = null;
// Setup the Discord Bot
const config = require('./config');
// If DCS integration is enabled in the config file, load the script and let the party begin. 
const dcsintegration = require('./DCS-integration');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const request = require('request');
const client = new Client({
  intents: [ 
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	],
});

// is the discord client ready? if so display in console.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    writelog('Bot has been started and logged into discord successfully.');
    client.channels.cache.get(config.targetChannel).send('U64 Server Management Bot Online. Server: ' + config.appservername);
    //client.channels.cache.get(config.targetChannel).send('');
});


// Start the DCS to U64 Listner if enabled in the config file.
if (config.dcsenabled = 1){
  dcsintegration.SetupDCSListener();
}

// ======================================================================================================================= 
// Where the actions begin
// ======================================================================================================================= 

// lets setup the applications for management
const { spawn } = require('child_process');

// Lets create a function for application management. 
function appManagement(App_Name, Action, msgContent, msgAuthor){
  // Lets look for the app in the app array and if exists then do it. 
  const foundApp = config.apps.filter(apps => apps.appname.toLowerCase() === App_Name.toLowerCase());
  if(Array.isArray(foundApp) && foundApp.length > 0) {
    // Ok app exists, lets do the action with it.
    // Some Debug stuff to be deleted later
    console.log(foundApp[0].appexec); 
    console.log(foundApp[0].path);    
    
    // Start App Function
    if (Action === '!start'){
      const { exec } = require('child_process');
      writelog("ACTION: " + msgContent + " by " + msgAuthor);
      const cmd = `tasklist /fi "imagename eq ${foundApp[0].appexec}"`; // for windows
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          writelog("ERROR: Command" + msgContent + " by " + msgAuthor + ": " + stderr);
          client.channels.cache.get(config.targetChannel).send(console.error(`Something f****d up, sorry: ${error}`));
          return;
        }
        if(stdout.includes(foundApp[0].appexec)) {
          console.log("The process is already running.");
          client.channels.cache.get(config.targetChannel).send('Um... its already running? if it isnt responding, try turning it off and on again.... or.... and Im just throwing this out there.... wait longer?');
        } else {
          console.log("The process is not running.");
          // Start the process
          if (foundApp[0].startup != ''){
            // if the application has a preloader like a updater that needs to run first, then lets run that.
            const AppLoad = spawn(foundApp[0].rootfolder + foundApp[0].path + foundApp[0].startup);
          } else {
            const AppLoad = spawn(foundApp[0].rootfolder + foundApp[0].path + foundApp[0].appexec);
          };
          client.channels.cache.get(config.targetChannel).send('Starting ' + foundApp[0].appname + ' now. Give it a minute.');
        }
      });
    }

    // Update App Function
    if (Action === '!update'){
      const { exec } = require('child_process');
      writelog("ACTION: " + msgContent + " by " + msgAuthor);
      const cmd = `tasklist /fi "imagename eq ${foundApp[0].appexec}"`; // for windows
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          writelog("ERROR: Command" + msgContent + " by " + msgAuthor + ": " + stderr);
          client.channels.cache.get(config.targetChannel).send(console.error(`Something f****d up, sorry: ${error}`));
          return;
        }
        if(stdout.includes(foundApp[0].appexec)) {
          console.log("A update command has been given but the application is already running, stop the process first.");
          client.channels.cache.get(config.targetChannel).send('The application is still running, stop the process first, then try the update command.');
        } else {
          if(stdout.includes(foundApp[0].update)) {
            // Freaking updater is already running. Dont run it again. 
            console.log("A update command has been given but the update process is already, stop the process first.");
            client.channels.cache.get(config.targetChannel).send('The application update is still running, wait for it to finish first.');
          } else {
             // Start the UPDATE process
            if (foundApp[0].update != ''){
              // load the application up
              writelog("UPDATE: Command" + msgContent + " by " + msgAuthor);
              // if the application has arguments for the update process, then lets run that.
              if (foundApp[0].updateargs != ''){
                const updateargs = foundApp[0].updateargs.split(" ");
                const AppLoad = spawn(foundApp[0].rootfolder + foundApp[0].path + foundApp[0].update, updateargs);
              } else {
                const AppLoad = spawn(foundApp[0].rootfolder + foundApp[0].path + foundApp[0].update);
              }; 
            } else {
               // App doesnt have a update executable configured. 
              console.log('Update command has been given for a app that doesnt exist. App:' + foundApp[0].appexec);
              client.channels.cache.get(config.targetChannel).send('That App doesnt have a update executable configured. WTF are you trying to do?');
            } 
            ;
            client.channels.cache.get(config.targetChannel).send('Updating ' + foundApp[0].appname + ' now. Give it a few minutes.');
          };
        }
      });
    }

    // status App Function
    if (Action === '!status'){
      const { exec } = require('child_process');
      writelog("ACTION: " + msgContent + " by " + msgAuthor);
      const cmd = `tasklist /fi "imagename eq ${foundApp[0].appexec}"`; // for windows
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          writelog("ERROR: Command" + msgContent + " by " + msgAuthor + ": " + stderr);
          client.channels.cache.get(config.targetChannel).send(console.error(`Something f****d up, sorry: ${error}`));
          return;
        }
        if(stdout.includes(foundApp[0].appexec)) {
          console.log("The process is running.");
          client.channels.cache.get(config.targetChannel).send('The process is running');
        } else {
          console.log("The process is not running.");
          client.channels.cache.get(config.targetChannel).send('The process is not running');
        }
      });
    }
    // status of Updater Function
    if (Action === '!updatestatus'){
      const { exec } = require('child_process');
      writelog("ACTION: " + msgContent + " by " + msgAuthor);
      const cmd = `tasklist /fi "imagename eq ${foundApp[0].update}"`; // for windows
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          writelog("ERROR: Command" + msgContent + " by " + msgAuthor + ": " + stderr);
          client.channels.cache.get(config.targetChannel).send(console.error(`Something f****d up, sorry: ${error}`));
          return;
        }
        if(stdout.includes(foundApp[0].update)) {
          console.log("The process is still running.");
          client.channels.cache.get(config.targetChannel).send('The process is still running');
        } else {
          console.log("The process is not running.");
          client.channels.cache.get(config.targetChannel).send('The process is not running anymore');
        }
      });
    }

    // Stop App Function
    if (Action === '!stop'){
      // ok they want us to stop a process
      const { exec } = require('child_process');
      writelog("ACTION: " + msgContent + " by " + msgAuthor);
      const cmd = `tasklist /fi "imagename eq ${foundApp[0].appexec}"`; // for windows
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          writelog("ERROR: Command: " + msgContent + " by " + msgAuthor + ": " + stderr);
          return;
        }
        if(stdout.includes(foundApp[0].appexec)) {
          console.log("The process is running and will be stopped.");
          client.channels.cache.get(config.targetChannel).send(`Murdering the ${foundApp[0].appname} server on your command.... you monster... `);
          const { exec } = require('child_process');
           exec(`taskkill /F /IM ${foundApp[0].appexec}`, (error, stdout, stderr) => {
             if (error) {
               console.error(`exec error: ${error}`);
               writelog("ERROR: Command: " + msgContent + " by " + msgAuthor + ": " + stderr);
               client.channels.cache.get(config.targetChannel).send(console.error(`Something f****d up, sorry: ${error}`));
               return;
             }
           });

        } else {
         client.channels.cache.get(config.targetChannel).send(foundApp[0].appname + ' isnt running');
        }
      });
    }

  } else {
    // App doesnt exist in array therefore tell the user its not setup
    client.channels.cache.get(config.targetChannel).send('That app isnt setup. If its a legit app, ask your admin to set it up');
  }
};

// A message has come through. Lets look at it and see if its for us.
client.on('messageCreate', (message) => {	
    // lets pull out the channel id and author that sent it and set it as a variable. 
    const msgchannelid = message.channel.id;
    const msgauthor = message.member;
    const MessageContent = message.content.toLowerCase();

    // Debug info in the console
    console.log('Inbound message from ' + msgauthor + ' says: '+ message.content);

    // if the message is from the target channel, then start timer for deletion.
    if (msgchannelid === config.targetChannel && config.autodeletetimer != 0) {
      setTimeout(() => {
        message.delete();
      }, 1000 * 60 * config.autodeletetimer); // delete message after 1mins
    }

    // ===========================================================================================================================
    // DCS Integration Test Section ==============================================================================================
    // ===========================================================================================================================
    if (msgchannelid === config.targetChannel && MessageContent.toLowerCase() === "!testdcs") {   
      dcsintegration.testDCS();
      client.channels.cache.get(config.targetChannel).send('Message Sent');
    };

    //if (dcsintegration.socketresults != '') {
    //  client.channels.cache.get(config.targetChannel).send('A Response!:' + dcsintegration.socketresults);
    //}

    // ===========================================================================================================================
    // ===========================================================================================================================

    // ok if the message comes from the target channel and starts with the command thing, lets move on with the checks.
    if (msgchannelid === config.targetChannel && MessageContent.charAt(0) === "!") {
        // Start by converting the command into a queryable array
        const commandArray = MessageContent.trim().split(" ");
        const [commandAction, commandApp, commandServer] = commandArray;
        // Debugging 
        console.log(commandArray);
        console.log(commandAction);
        
        // possible app manangement actions available.
        const possibleactions = /(!start|!stop|!status|!update|!updatestatus)/;

        if (possibleactions.test(commandAction) && commandServer === config.appservername) {
          // This is a legit command so send it to the appManagement function for processing.
           appManagement(commandApp, commandAction, MessageContent, msgauthor);
        } 
        
        // ======================================================================================================================= 
        // OPERATING SYSTEM CODE HERE 
        // ======================================================================================================================= 
        // Looking for the command to REBOOT Server
        const command02 = '!reboot';
        if (MessageContent === (command02 + ' ' + config.appservername)) {
            // ok reboot command has been issued, run powershell and execute the command.
            writelog("ACTION: " + message.content + " by " + message.member);
            client.channels.cache.get(config.targetChannel).send('Trying the ol try turning it off then on again method eh? sweet as, lets do this');
            // Delete the messages in the channel. 
            message.delete();
                        
            const { exec } = require('child_process');
            exec('powershell.exe -Command "shutdown -r -t 0"', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    writelog("ERROR: Command" + message.content + " by " + message.member + ": " + stderr);
                    return;
                }
                console.log(stdout);
            });
        };

        // ======================================================================================================================= 
        // SUPER ADMIN AREA - Code only the super admin can execute
        // ======================================================================================================================= 
        if (message.member == config.superadmin) {
          // Whats the Super Admin want?
          const godcomplex01 = '!tasklist';
          if (MessageContent === (godcomplex01 + ' ' + config.appservername)) {
            writelog("SUPER ADMIN ACTION: " + message.content + " by " + message.member);
              // This function gets the tasklist for Super Admin
              client.channels.cache.get(config.targetChannel).send('Everyone shutup!, the Super Admin wants the servers Tasklist for some reason...');
              const { exec } = require('child_process');
              exec('tasklist /fi "SESSIONNAME eq Console"', (error, stdout, stderr) => {
                  if (error) {
                      console.error(`exec error: ${error}`);
                      client.channels.cache.get(config.targetChannel).send(stderr);
                      writelog("ERROR: Command: " + message.content + " by " + message.member + ": " + stderr);
                      return;
                  }
                  console.log(stdout)
                  
                  // Can only send 2000 characters at a time.... lets chunk it up and send it.
                  const chunkSize = 2000;
                  const chunks = stdout.match(new RegExp(`.{1,${chunkSize}}`, 'g'));

                  chunks.forEach((chunk, i) => {
                      setTimeout(() => {
                          client.channels.cache.get(config.targetChannel).send(chunk);
                          // The super admin is doing something, lets capture a log with the output.
                          writelog("TASKLIST:" + chunk);
                          if (i === chunks.length - 1) {
                            client.channels.cache.get(config.targetChannel).send("============= EOM ============= ");
                        }
                      }, i * 1000);
                  });
              });
          };
        };
        
        // If someone wants to test to make sure the bot is actually listening then... well... ok....
        if (MessageContent === '!test ' + config.appservername){
          client.channels.cache.get(config.targetChannel).send("Sup..... Im listening.... Always creeping in this channel....");
        }


        // ======================================================================================================================= 
        // Upload of files from attachments. Lets make this specifically .miz files for DCS world.
        // ======================================================================================================================= 
        const request = require('request');

        if (MessageContent === '!upload ' + config.appservername && message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.name.endsWith(".miz")) {
                const url = attachment.url;
                const filename = attachment.name;
                const downloadDir = config.dcsmissionfolder;

                if (filename.endsWith(".miz")) { 
                  // checking for the desired file type
                    const file = fs.createWriteStream(`${downloadDir}/${filename}`);
                    request(url).pipe(file);

                    file.on('finish', () => {
                        if (config.defenderenable === 1) {
                          // This kicks of the MS Defender Scan on the file to ensure its good.
                          const { exec } = require('child_process');
                          exec(`powershell.exe -Command start-MPScan -ScanPath '${downloadDir}/${filename}' -ScanType CustomScan`, (error, stdout, stderr) => {
                            writelog(`DEFENDER SCAN: ${downloadDir}/${filename} - ${stdout}`);
                              if (error) {
                                  console.error(`exec error: ${error}`);
                                  client.channels.cache.get(config.targetChannel).send(stderr);
                                  writelog("ERROR: running Defender SCAN" + stderr);
                                  return;
                              };
                          });
                        };
                        client.channels.cache.get(config.targetChannel).send("File Uploaded");
                        console.log(`Downloaded ${filename} to ${downloadDir}`);
                        writelog('UPLOAD by ' + msgauthor + ` ${filename} to ${downloadDir}`);
                    });
                    file.on('error', (err) => {
                        console.error(err);
                        client.channels.cache.get(config.targetChannel).send("Error: " + error(err));
                        writelog('ERROR File Upload: ' + msgauthor + `${filename} to ${downloadDir}: ${error(err)}`);
                    });
                } else {
                    console.log("Invalid file type, only .miz files are allowed.");
                    client.channels.cache.get(config.targetChannel).send("Invalid file type, only .miz files are allowed.");
                };
            } else {
                console.log("No attachment found.");
                client.channels.cache.get(config.targetChannel).send("No attachment found? WTF are you doing");
            };
        };

        // Add more stuff here.
        
       
    };
});


// ======================================================================================================================= 
// Logging Capability  
// ======================================================================================================================= 
// Create a variable to store the current date
let currentDate = new Date().toISOString().slice(0, 10);

// Create a function to write log entries
function writelog(logEntry) {
    // Get the current date
    let date = new Date().toISOString().slice(0, 10);
    let time = new Date().toLocaleTimeString();

    // Check if the date has changed
    if (date !== currentDate) {
        // Update the current date
        currentDate = date;

        // Create a new log file with the new date
        let logFileName = `u64bot-${date}.log`;
        fs.writeFileSync(logFileName, '');
    }

    // Open the log file and append the new log entry
    let logFileName = `u64bot-${currentDate}.log`;
    fs.appendFileSync(logFileName, `${date} - ${time}: ${logEntry}\r\n`);
};

// Check the date every hour - Forces Node JS to update the variable so it knows when to do a log rotation.
setInterval(() => {
    let currentDate = new Date().toISOString().slice(0, 10);
    let date = new Date().toISOString().slice(0, 10);
    let time = new Date().toLocaleTimeString();
    console.log(`${date} - ${time}: Checking date... ${currentDate}\r\n`);
}, 3600000);


// ======================================================================================================================= 
// Discord client login
// ======================================================================================================================= 
client.login(config.botToken);