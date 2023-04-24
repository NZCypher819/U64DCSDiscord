## Reference File to compare against.
$fileA = "C:\DCS\MissionScripting.lua"
## Target File. If this doesnt match the reference file then we will overwrite this one. 
$fileB = "C:\Program Files\Eagle Dynamics\DCS World OpenBeta\Scripts\MissionScripting.lua"

if((Get-FileHash $fileA).hash  -ne (Get-FileHash $fileB).hash) {
    ## files are different - They must have updated it... Lets change it back. 
    Copy-Item $fileA -Destination "C:\Program Files\Eagle Dynamics\DCS World OpenBeta\Scripts\" -Recurse -force
    }

Else {
    "Files are the same"}