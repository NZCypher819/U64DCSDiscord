# DCS Dedicated Server Setup Guide
This guide provides step by step on how to build a DCS dedicated server for your squadron with the U64 Discord Bot. It is based on the [DCS World Open Beta Server](https://www.digitalcombatsimulator.com/en/download/other/dcs_world_open_beta_server/) and [DCS-SimpleRadio-Standalone](https://github.com/ciribob/DCS-SimpleRadioStandalone/releases). It also includes a Discord bot that can be used to manage the server.

The guide is based on using Windows Server 2019 post install. It is assumed that you have a basic understanding of Windows Server and how to use it.

It also includes a extra add on for onboarding to Azure Arc for management.

## Table of Contents

1. DCS OpenBeata Server Setup
2. DCS-SimpleRadio-Standalone Setup
3. DCS Discord Bot Setup
4. Windows Configuration
5. Onboarding to Azure Arc for Management

## DCS OpenBeta Server Setup
Pre-requisites
- Windows Server 2016 - 22
- DCS World Open Beta Server
- DCS Account specific for this server install. Does not need modules, just the login details.

1. Download [DCS World Open Beta Server](https://www.digitalcombatsimulator.com/en/download/other/dcs_world_open_beta_server/) to the server.
2. Drive setup. 
It is recommended to have a separate drive for the DCS server. This is because the DCS server can get quite large and you dont want to fill up your C: drive. As of 24 April 2023 the DCS server root directory is about 180gb, and the updater needs head room as well. Ideally you have a 500gb drive to install it to. 

    DCS also has a Saved Game folder in the users profile. This is where the server will store its config files. Generally this is were the server will store its logs and mission files.

    You'll need a small folder somewhere for the DCS management scripts as well. 

    You'll end up with three folders. 
    DCS Root Install Folder. This is where the DCS server will be installed to. Referred in this guide as <DCSRoot>.
    DCS Saved Games Folder. This is where the DCS server will store its config files. Referred in this guide as <DCSSavedGames>.
    DCS Scripts Folder. This is for extra scripts for management and the Discord bot to run from. Referrred in this guide as <DCSScripts>.

3. Run the installer you downloaded in Step 1. Ensure its installed into the <DCSRoot> directory. 
4. Once installed, you have two icons on your desktop called DCS World OpenBeta Server and Local Web GUI. Run the DCS World OpenBeta Server. It will ask for a username and password, this is the specific username and password for this server. Do not use your own account as you can only have one instance of DCS running at a time.

    Once thats done, close the DCS World OpenBeta Server. This enables the setup of the server for the first time. 
5. Open the <DCSSavedGames> folder. You should see a folder called Config. Open that folder and you should see a file called serverSettings.lua. Open that file in notepad.
    Edit the following fields to your specific installation requirements.

        ["password"] = "MyPassword",
        ["name"] = "My Dedicated Server 1 ",

    Take note of the Port as well. If you change this, you'll need to update the firewall rules going forward. 

    Save the file and close notepad. 
6. Installing the SuperCarrier Mod.
    Open a command prompt and navigate to the <DCSRoot> \bin folder. Run the following command.

        dcs_updater.exe install SUPPERCARRIER

    If you need other mods for the server, you can install them in the same way.

7. Persistence with Missions.
    Inside the <DCSRoot> folder there is Scripts. Open the file MissionScripting.lua in notepad. 

    Locate these lines and comment them out. 

        sanitizeModule('io')
        sanitizeModule('lfs')

    So they look like this.

        --sanitizeModule('io')
        --sanitizeModule('lfs')

    Save the file and close notepad.

8. DCS server is in its basic setup now. 

## DCS-SimpleRadio-Standalone Setup
Most squardrons use SRS for there radio comms. If yours doesnt, skip this section and the scheduled task for SRS. Otherwise, follow the steps below.

Follow the install instructions from SRS can be found [here](https://github.com/ciribob/DCS-SimpleRadioStandalone/wiki/SRS-Server-(WIP))

For the rest of this guide, the installation directory you installed SRS into will be referred to as <SRSRoot>.

## DCS Discord Bot Setup
On the readme page for the U64 Discord Bot, there is a section on how to setup the bot. Follow those instructions to get the bot up and running.

## Windows Configuration
Ok with DCS Installed and configured, we need to configure the Windows Server to run the DCS server and the Discord bot.

First off download the scripts in the repo and extract them to the <DCSScripts> folder.

Ensure you modify the DSC-Mission-Persistence.ps1 script to point to the correct <DCSRoot> folder. 

### Scheduled Tasks
Scheduled tasks are the easiest way to run the DCS server and the Discord bot. We need three of them.

- Restart Server
- Start DCS Server
- Start SRS Server
- Start Discord Bot

#### Restart Server
This task will restart the server every day at midday (when people are working and not playing sims). This is to ensure that the server is restarted and any updates are applied. This is particularly handy for some mission files with persistence as they tend to flake out after a while and crash the server. 

1. Open the Task Scheduler.
2. Right click on Task Scheduler Library > Create Basic Task.
3. Name the task Restart Server. Click Next.
4. Set the trigger to Daily. Click Next.
5. Recur every 1 day(s). Click Next.
6. Set the start time to 12:00:00.
7. Set the action to Start a program.
8. Set the program/script to "C:\Windows\System32\shutdown.exe"
9. Set the arguments to "-r -t 0"
10. Click Next.
11. Click Finish.

You can test this by right clicking on the task and selecting Run. Server should restart.

#### Start DCS Server
This task will start the DCS updater first, then run a script that will check for the persistence in the MissionScripting.lua folder, then start the DCS server.

There are 3 Actions that need to take place, and more importantly, in order. 

1. dcs_updater.exe --quiet update @openbeta    (This will update the server in silent mode (no prompts) to the latest version of the OpenBeta)
2. powershell.exe -ExecutionPolicy Bypass -File <DCSScripts>\DCS-Mission-Persistence.ps1   (This will check to ensure persistence is still enabled as the update normally disables it)
3. dcs_updater.exe    (This will start the DCS server)

The Scheduled Task will look like this:
1. Open the Task Scheduler.
2. Right click on Task Scheduler Library > Create Basic Task.
3. Name the task Start DCS Server. Click Next.
4. Set the trigger to "When I Log On" and click Next.
5. Set the action to Start a program.
6. Set the program/script to "<DCSRoot>\bin\DCS_updater.exe"
7. Set the arguments to "--quiet update @openbeta" (This will update the server to the latest version of the OpenBeta)
8. Click Next.
9. Ensure 'Open the Properties dialog for this task when I click Finish' is ticked... Then, click Finish.
10. With the Properties dialog open, click on the Actions tab.
11. Click New. With the following settings:
    - Action: Start a program
    - Program/script: "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
    - Add arguments: "-ExecutionPolicy Bypass -File <DCSScripts>\DCS-Mission-Persistence.ps1"
    - Start in: <DCSScripts>
12. Click OK.
13. Click New. With the following settings:
    - Action: Start a program
    - Program/script: "<DCSRoot>\bin\DCS_updater.exe"   
14. Click OK.

#### Start SRS Server
This task will start the SRS server on Login. 

1. Open the Task Scheduler.
2. Right click on Task Scheduler Library > Create Basic Task.
3. Name the task Start SRS Server. Click Next.
4. Set the trigger to "When I Log On" and click Next.
5. Set the action to Start a program.
6. Set the program/script to "<SRSRoot>\SRS-server.exe"
7. Click Next.
8. Click Finish.

#### Start Discord Bot
This task will start the Discord bot on Login.

1. Open the Task Scheduler.
2. Right click on Task Scheduler Library > Create Basic Task.
3. Name the task Start Discord Bot. Click Next.
4. Set the trigger to "When I Log On" and click Next.
5. Set the action to Start a program.
6. Set the program/script to "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
7. Set the arguments to "-node .\u64-dcs-discordbot.js"
8. Set the Start in: '<DCSScripts>\U64-Discord-Bot' (This is the folder you extracted the bot to)

### Auto Login
To ensure that the server is always running, we need to configure the server to auto login. DCS needs to run from the console and currently cannot run as a service. Annoying but it works.

Follow this guide to set this up for the user account you have configured for the server.
https://learn.microsoft.com/en-us/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon

## Onboarding Azure Arc for Management
Now that the server is configured, we need to onboard it to Azure Arc for Management. This will allow us to manage the server from the Azure Portal. This part is entirely optional, but it is a nice to have. Works really well when your server is hosted elsewhere, and you dont want to open up RDP to the internet. 

1. Open Azure Portal and Login.
2. In the top search bar, type Azure Arc and select it. 
3. Under Infrastructure, select Servers.
4. Click on the + Add button.
5. Select the server you want to onboard.
6. Follow the instructions to onboard the server.

Once done, the server will appear in the Azure Portal under Azure Arc > Servers. If you have defaults set for extensions extra they will install automatically. If not, you can install them manually.

Next we need to setup Windows Admin Center. This is a free tool from Microsoft that allows you to manage your servers from the Azure Portal.

1. Select the server in the Azure Portal.
2. Select Windows Admin Center (preview)
3. Click on Setup and follow the instructions. 
4. Give it a few minutes to get everything sorted. Then hit connect. 

