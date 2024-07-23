
# Define the command and arguments
$command = "run-in-roblox"
$arguments = "--place dev.rbxl --script out/run-tests.server.lua"

# Run the command
Start-Process -FilePath $command -ArgumentList $arguments -NoNewWindow -Wait
