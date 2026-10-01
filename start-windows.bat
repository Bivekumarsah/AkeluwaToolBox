@echo off
setlocal
cd /d "%~dp0"
call "pdf-size-reducer-ready\pdf-size-reducer\run_windows.bat" --toolbox
