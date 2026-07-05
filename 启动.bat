@echo off
rem ==== Chongqing Foreign-Trade Auto Outreach : local launcher ====
rem Double-click to start. KEEP THIS WINDOW OPEN while using the system.
rem Port 4174 is FIXED on purpose: your data lives in the browser under
rem   http://localhost:4174 - changing the port hides all your data.
cd /d "%~dp0"
start "" "http://localhost:4174/"
python -m http.server 4174
if errorlevel 1 py -3 -m http.server 4174
pause
