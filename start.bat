@echo off
setlocal

cd /d "%~dp0"

echo Running Python script: backend\main.py


cd backend

python main.py


if %errorlevel% neq 0 (
echo !!! ERROR: The Python script exited with code %errorlevel%. !!!
) else (
echo.
echo Script finished successfully.
)


pause

endlocal