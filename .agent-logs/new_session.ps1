<#
.SYNOPSIS
    Initialises a new session log file and prints the env vars to set.

.DESCRIPTION
    Run this at the start of every new agent session:
        . .\.agent-logs\new_session.ps1
    (dot-sourced so the env vars persist in your shell)

    It generates a fresh UUID for AGENT_SESSION_ID and a log file path for
    AGENT_LOG_FILE, then calls log_entry.ps1 -Type HEADER to write the front-matter.
#>

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

$sessionId  = [System.Guid]::NewGuid().ToString()
$utcNow     = [System.DateTime]::UtcNow
$fileStamp  = $utcNow.ToString("yyyy-MM-dd_HH-mm-ss")
$logFile    = Join-Path $scriptDir "${fileStamp}_${sessionId}.md"

$env:AGENT_SESSION_ID = $sessionId
$env:AGENT_LOG_FILE   = $logFile

Write-Host "Session initialised"
Write-Host "  AGENT_SESSION_ID = $sessionId"
Write-Host "  AGENT_LOG_FILE   = $logFile"

# Write the file header
& "$scriptDir\log_entry.ps1" `
    -Type      "HEADER" `
    -SessionId $sessionId `
    -Content   "" `
    -LogFile   $logFile
