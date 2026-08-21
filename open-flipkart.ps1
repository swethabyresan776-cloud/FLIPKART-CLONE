$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = 8000
$url = "http://localhost:$port"

try {
    $listener = [System.Net.Sockets.TcpClient]::new()
    $listener.Connect('127.0.0.1', $port)
    $listener.Close()
    Write-Host "Server already running at $url"
}
catch {
    Start-Process python -ArgumentList '-m', 'http.server', $port
    Start-Sleep -Seconds 1
    Write-Host "Started local server at $url"
}

Start-Process $url
Write-Host "Opening $url"
