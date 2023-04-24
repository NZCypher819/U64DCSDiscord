# This installer is for the server side of the bot, DCS and SRS. It downloads Node JS, installs it and the discord.js module, then installs DCS Open Beta and SRS
# This code is buggy, only use it if your prepared to fix it.

# Download the latest version of Node.js
Invoke-WebRequest -Uri https://nodejs.org/dist/v18.13.0/node-v18.13.0-x64.msi -OutFile nodejs.msi

# Install Node.js
Start-Process msiexec.exe -Wait -ArgumentList '/i nodejs.msi /quiet'

# Add Node.js to the system PATH
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs\", "User")

# Install request package
npm install request

# Install discord.js module
npm install discord.js

# Install nodemon module
npm install nodemon

# Download the DCS World Server Open Beta
Invoke-WebRequest -Uri https://www.digitalcombatsimulator.com/upload/iblock/937/DCS_World_OpenBeta_Server_web_5.exe -OutFile DCS_World_Server_Open_Beta.exe

# Install DCS World Server Open Beta
Start-Process .\DCS_World_Server_Open_Beta.exe -Wait 

# Download the DCS Simple Radio System
Invoke-WebRequest -Uri https://github.com/ciribob/DCS-SimpleRadioStandalone/releases/download/2.0.8.2/SRS-AutoUpdater.exe -OutFile SRS_Installer.exe

# Install DCS Simple Radio System
Start-Process .\SRS_Installer.exe -Wait 

