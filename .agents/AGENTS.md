# Agent Logging Rule — 8x Assignment Capture

## MANDATORY: Log every prompt and response

At the **end of every turn**, you MUST call the logging script to record the exchange.
This rule fires automatically on every turn because it is part of the workspace AGENTS.md.

### Log file location
All logs go to: `d:\PDF Files\self\latest\applications\8x\assessment\recall\.agent-logs\`

### Session state
The current session log file path is stored in `$env:AGENT_LOG_FILE`.
The current session ID is stored in `$env:AGENT_SESSION_ID`.

If those env vars are not set (e.g. first turn of a new session), you must:
1. Generate a session ID: use the conversation ID from your context
2. Create the log file: `YYYY-MM-DD_HH-MM-SS_<session-id>.md` (UTC)
3. Call `log_entry.ps1 -Type HEADER` to write the front-matter

### Per-turn procedure (MANDATORY, every turn without exception)

At the END of your response, after all other work is done, run TWO commands:

**1. Log the PROMPT** (what the user sent):
```powershell
powershell -ExecutionPolicy Bypass -File ".agent-logs\log_entry.ps1" `
  -Type PROMPT -Num <exchange_num> `
  -SessionId "<session_id>" `
  -Content "<verbatim user prompt>" `
  -LogFile "<log_file_path>"
```

**2. Log the RESPONSE** (your final reply to the user):
```powershell
powershell -ExecutionPolicy Bypass -File ".agent-logs\log_entry.ps1" `
  -Type RESPONSE -Num <exchange_num> `
  -SessionId "<session_id>" `
  -Content "<your complete final response text>" `
  -LogFile "<log_file_path>"
```

### Rules
- Do NOT truncate or paraphrase the prompt or response. Verbatim, in full.
- Do NOT skip logging on turns where you made mistakes. Those are the most important.
- Do NOT add `.agent-logs/` to `.gitignore`.
- The exchange number increments by 1 per user prompt (PROMPT and RESPONSE share the same num).
- If writing the content inline in the command would be too long, write it to a temp file first then pass the file path.

### Model name
Always use: `claude-sonnet-4-6-thinking`

### Author
Always use: `mzu-2410z`

### Project
Always use: `recall`
