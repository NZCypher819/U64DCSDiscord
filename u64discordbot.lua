-- U64 Discord Bot - DCS Server Component
-- Author: U64 NZCypher819
-- Version: 0.1
-- Date: 2023-02-15 
-- Description: This is a attempt to create a hook for DCS to open a socket to the node js script.
-- This does actually connect to the socket but the bot isnt able to send/recieve messagess from the hook. No idea why.


local default_output_file = nil

function LuaExportStart()
  -- Works once just before mission start.
  -- Make initializations of your files or connections here.
  -- For example:
  -- 1) File
  --   default_output_file = io.open(lfs.writedir().."/Logs/Export.log", "w")
  -- 2) Socket
  package.path  = package.path..";"..lfs.currentdir().."/LuaSocket/?.lua"
  package.cpath = package.cpath..";"..lfs.currentdir().."/LuaSocket/?.dll"
  socket = require("socket")
  host = "localhost"
  port = 8124
  c = socket.try(socket.connect(host, port)) -- connect to the listener socket
  c:setoption("tcp-nodelay",true) -- set immediate transmission mode
 
 	local version = LoGetVersionInfo() --request current version info (as it showed by Windows Explorer fo DCS.exe properties)
    if version and default_output_file then
 	    
 		default_output_file:write("ProductName: "..version.ProductName..'\n')
 		default_output_file:write(string.format("FileVersion: %d.%d.%d.%d\n",
 												version.FileVersion[1],
 												version.FileVersion[2],
 												version.FileVersion[3],
 												version.FileVersion[4]))
 		default_output_file:write(string.format("ProductVersion: %d.%d.%d.%d\n",
 												version.ProductVersion[1],
 												version.ProductVersion[2],
 												version.ProductVersion[3],  -- head  revision (Continuously growth)
												version.ProductVersion[4])) -- build number   (Continuously growth)	
    end
end

function LuaExportStop()
    -- Command for the Socket to close has been sent. 
    socket.try(c:send("quit")) -- to close the listener socket
    c:close()
end

-- Load requested mission file.
function missionLoad(mizFile)
    net.load_mission(missionLoad.mizFile)
end

LuaExportStart()

-- This looks for messages recieved and then does something with it.
while true do
    local data = server:receive()
    if data == 'runFunction' then
      -- run the function
      local results = LuaExportStop()
      -- send the results back to the Node.js script
      server:send(results)
    end
    if data == 'loadMissionFile' then
        server:send("Loading the mission now")
        local results = missionLoad("C:\users\Administrator\Saved Games\DCS.openbeta_server\missions\formation_trainer_by_d0ppler.miz")
    end
  end