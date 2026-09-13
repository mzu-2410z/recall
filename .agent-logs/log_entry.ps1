<#
.SYNOPSIS
    Appends a PROMPT or RESPONSE log entry to the session log file.

.DESCRIPTION
    Called by the agent rule at the end of every turn to record prompt/response pairs.
    Writes to .agent-logs/<YYYY-MM-DD_HH-MM-SS_<session-id>.md>

.PARAMETERS
    -Type       PROMPT | RESPONSE
    -Num        Exchange number (integer)
    -SessionId  UUID of the session
    -Model      Model name string
    -Author     GitHub handle
    -Content    The verbatim text to record
    -LogFile    Absolute path to the session log file

    If -LogFile is omitted, the script reads AGENT_LOG_FILE env var, or creates a new
    file named after the current UTC timestamp + session id in the same directory as
    the script.
#>
param(
    [Parameter(Mandatory)][ValidateSet("PROMPT","RESPONSE","HEADER")][string]$Type,
    [int]$Num = 0,
    [string]$SessionId = $env:AGENT_SESSION_ID,
    [string]$Model = "claude-sonnet-4-6-thinking",
    [string]$Author = "mzu-2410z",
    [string]$Tool = "antigravity",
    [string]$Project = "recall",
    [Parameter(Mandatory)][string]$Content,
    [string]$LogFile = $env:AGENT_LOG_FILE
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$utcNow    = [System.DateTime]::UtcNow
$timestamp = $utcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

# ── Resolve / create log file path ───────────────────────────────────────────
if (-not $LogFile) {
    if (-not $SessionId) {
        $SessionId = [System.Guid]::NewGuid().ToString()
    }
    $fileStamp = $utcNow.ToString("yyyy-MM-dd_HH-mm-ss")
    $LogFile   = Join-Path $scriptDir "${fileStamp}_${SessionId}.md"
}

# ── Write YAML front-matter header if this is a new file ─────────────────────
if (-not (Test-Path $LogFile)) {
    $header = @"
---
session_id: $SessionId
date: $($utcNow.ToString("yyyy-MM-dd"))
author: $Author
model: $Model
tool: $Tool
project: $Project
total_exchanges: 0
first_prompt_time: $timestamp
last_prompt_time: $timestamp
---

# Session Log - $($utcNow.ToString("yyyy-MM-dd"))

Session: ``$($SessionId.Substring(0,[Math]::Min(8,$SessionId.Length)))`` | Project: ``$Project`` | Author: ``$Author``

---

"@
    [System.IO.File]::WriteAllText($LogFile, $header, [System.Text.Encoding]::UTF8)
}

# ── Build the log entry block ─────────────────────────────────────────────────
if ($Type -eq "HEADER") {
    # Nothing extra needed beyond the header above — used for file init only.
    Write-Host "Log file initialised: $LogFile"
    return
}

$shortSession = $SessionId.Substring(0, [Math]::Min(8, $SessionId.Length))
$entry = @"

[LOG_ENTRY type=$Type num=$Num session=$shortSession]
timestamp: $timestamp
model: $Model

$Content


"@

Add-Content -Path $LogFile -Value $entry -Encoding UTF8

# ── Update last_prompt_time and total_exchanges in the front-matter ───────────
$raw = [System.IO.File]::ReadAllText($LogFile, [System.Text.Encoding]::UTF8)
$raw = $raw -replace 'last_prompt_time: [^\r\n]+', "last_prompt_time: $timestamp"

# Increment total_exchanges
if ($raw -match 'total_exchanges: (\d+)') {
    $current = [int]$Matches[1]
    if ($Type -eq "PROMPT") {
        $raw = $raw -replace 'total_exchanges: \d+', "total_exchanges: $($current + 1)"
    }
}

[System.IO.File]::WriteAllText($LogFile, $raw, [System.Text.Encoding]::UTF8)

Write-Host "[$Type #$Num] appended to: $LogFile"
