@echo off
setlocal EnableExtensions
cd /d "%~dp0"

call "%~dp0compile.bat"
if errorlevel 1 exit /b 1

set "DEST="
if defined CATALINA_HOME set "DEST=%CATALINA_HOME%\webapps\basic-servlets"
if not defined DEST if exist "C:\Program Files\Apache Software Foundation\Tomcat 11.0\webapps" set "DEST=C:\Program Files\Apache Software Foundation\Tomcat 11.0\webapps\basic-servlets"
if not defined DEST if exist "C:\apache-tomcat-11.0.24\webapps" set "DEST=C:\apache-tomcat-11.0.24\webapps\basic-servlets"

if not defined DEST (
  echo Tomcat webapps folder not found. Set CATALINA_HOME, then run this again.
  echo Or copy this whole folder into Tomcat\webapps\basic-servlets yourself.
  exit /b 1
)

echo Deploying to %DEST%
if not exist "%DEST%" mkdir "%DEST%"
robocopy "%cd%" "%DEST%" /E /NFL /NDL /NJH /NJS /XD .git .vercel lib work logs .idea .vscode
if errorlevel 8 (
  echo Copy failed. If Tomcat is under Program Files, run this as Administrator.
  exit /b 1
)
echo Deployed. Open http://localhost:8080/basic-servlets/
endlocal
