@echo off
setlocal

:: This script is designed to run the main entry point (main.py) from the
:: backend package root, ensuring the script runs in the correct environment.

:: Set the current directory to the location of the batch file (project root)
cd /d "%~dp0"

echo Running Python script: backend\main.py

:: Change directory to the 'backend' folder (the package root)
cd backend

:: Execute the main entry point (main.py) from the 'backend' folder.
python main.py

:: Check the exit code of the Python script
if %errorlevel% neq 0 (
echo.
echo -----------------------------------------------------------------
echo !!! ERROR: The Python script exited with code %errorlevel%. !!!
echo -----------------------------------------------------------------
) else (
echo.
echo Script finished successfully.
)

:: Pause the window so you can review the output
pause

endlocal