# Auto-Startup Guide for CryptoSolve

This guide shows how to make CryptoSolve start automatically on your system.

## Windows - Task Scheduler (Easiest)

### Method 1: Create Scheduled Task (GUI)

1. **Open Task Scheduler**
   - Press `Win + R`
   - Type `taskschd.msc`
   - Press Enter

2. **Create Basic Task**
   - Right-click "Task Scheduler Library" → "Create Basic Task"
   - Name: `CryptoSolve Auto-Start`
   - Description: "Automatically start CryptoSolve services"
   - Click "Next"

3. **Set Trigger**
   - Select "At log on"
   - Click "Next"

4. **Set Action**
   - Select "Start a program"
   - Program: `powershell.exe`
   - Arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\path\to\cryptosolve\startup.ps1"`
   - Click "Next"

5. **Finish**
   - Check "Open the Properties dialog for this task when I click Finish"
   - Click "Finish"

6. **Configure Security**
   - General tab → Check "Run whether user is logged in or not"
   - Security Options → Check "Run with highest privileges"
   - Click OK

### Method 2: PowerShell Script

Run this once to set up auto-start:

```powershell
# Run as Administrator
$taskName = "CryptoSolve"
$scriptPath = "C:\Users\rudra\OneDrive\Desktop\cryptosolve\startup.ps1"

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File '$scriptPath'"

$trigger = New-ScheduledTaskTrigger -AtLogOn

$principal = New-ScheduledTaskPrincipal -UserID "$env:USERDOMAIN\$env:USERNAME" `
  -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal `
  -Description "Automatically start CryptoSolve services" `
  -Force

Write-Host "Task created: $taskName" -ForegroundColor Green
```

### Method 3: Startup Folder

1. Press `Win + R`
2. Type: `shell:startup`
3. Create a shortcut to `startup.ps1`
   - Right-click in folder → New → Shortcut
   - Target: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\path\to\startup.ps1"`
   - Name: "CryptoSolve"

## Docker - Automatic Restart

When using Docker, add restart policy:

```bash
docker-compose up -d --restart unless-stopped
```

Or in `docker-compose.yml`:

```yaml
services:
  backend:
    restart: unless-stopped
  frontend:
    restart: unless-stopped
```

## Linux - systemd Service

Create `/etc/systemd/system/cryptosolve.service`:

```ini
[Unit]
Description=CryptoSolve Platform
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=cryptosolve
WorkingDirectory=/opt/cryptosolve
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cryptosolve
sudo systemctl start cryptosolve
sudo systemctl status cryptosolve
```

## Linux - Cron Job

Edit crontab:

```bash
crontab -e
```

Add this line (runs every minute, starts services if not running):

```
* * * * * cd /opt/cryptosolve && ./startup.sh >> /var/log/cryptosolve.log 2>&1
```

Create `startup.sh`:

```bash
#!/bin/bash
if ! docker-compose ps | grep -q "Up"; then
  docker-compose up -d
fi
```

## Windows - Startup via .bat File

Create `cryptosolve-startup.bat`:

```batch
@echo off
REM Navigate to project directory
cd /d "C:\Users\rudra\OneDrive\Desktop\cryptosolve"

REM Start services
start "" call .\start-backend.ps1
timeout /t 3
start "" call .\start-frontend.ps1

exit
```

Then add to Task Scheduler pointing to this `.bat` file.

## Monitoring Auto-Startup

### Windows

```powershell
# Check if task is enabled
Get-ScheduledTask -TaskName "CryptoSolve" | Select-Object State

# View task history
Get-ScheduledTaskInfo -TaskName "CryptoSolve"

# View task details
Get-ScheduledTask -TaskName "CryptoSolve" | Export-ScheduledTask
```

### Docker

```bash
# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Check restart policy
docker inspect <container-id> | grep -i restart
```

### Linux

```bash
# Check service status
sudo systemctl status cryptosolve

# View service logs
sudo journalctl -u cryptosolve -f

# Check if enabled
sudo systemctl is-enabled cryptosolve
```

## Troubleshooting

### Services don't start automatically

1. **Check Task Scheduler**
   - Open Task Scheduler
   - Look for "CryptoSolve" task
   - Right-click → "Run" to test
   - Check "Run with highest privileges" is enabled

2. **Check logs**
   - Windows: Event Viewer → Windows Logs → Application
   - Docker: `docker-compose logs`
   - Linux: `journalctl -u cryptosolve`

3. **Check permissions**
   - Ensure user has execute permission on scripts
   - Run PowerShell as Administrator

### Services start but don't run properly

1. **Check if ports are in use**
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :5500
   ```

2. **Check environment variables**
   - Ensure `.env.local` exists in `backend/`
   - Verify API keys are set

3. **Check logs**
   - Backend: Look for error messages in terminal
   - Frontend: Check browser console (F12)

## Testing Auto-Startup

### Test before rebooting

```powershell
# Windows - Test Task Scheduler task
# Open Task Scheduler, right-click task, click "Run"
Get-ScheduledTask -TaskName "CryptoSolve" | Start-ScheduledTask

# Or manually test the startup script
.\startup.ps1
```

### After reboot

1. Check if services are running
2. Verify in browser: http://localhost:5500
3. Check backend: http://localhost:3000/api/price

## Disable Auto-Startup

### Windows - Disable Task Scheduler

```powershell
# Disable task
Disable-ScheduledTask -TaskName "CryptoSolve"

# Or remove it
Unregister-ScheduledTask -TaskName "CryptoSolve" -Confirm:$false
```

### Docker - Don't restart

```bash
docker-compose down
```

### Linux - Disable systemd service

```bash
sudo systemctl disable cryptosolve
sudo systemctl stop cryptosolve
```

## Advanced: Health Checks

### Docker Compose with Health Checks

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/price"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5500"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Monitoring with Uptime Kuma

Set up free monitoring at https://uptime.kuma.pet/:

1. Deploy Uptime Kuma
2. Add monitors:
   - `http://localhost:3000/api/price`
   - `http://localhost:5500`
3. Get alerts if services go down

---

**All methods ensure CryptoSolve runs automatically on startup!**
