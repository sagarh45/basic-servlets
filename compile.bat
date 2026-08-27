@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if not exist src\*.java (
  echo No Java files in src\
  exit /b 1
)

if not exist WEB-INF\classes mkdir WEB-INF\classes
if not exist lib mkdir lib

set "CP="
if exist "lib\jakarta.servlet-api.jar" set "CP=lib\jakarta.servlet-api.jar"
if not defined CP if exist "%CATALINA_HOME%\lib\servlet-api.jar" set "CP=%CATALINA_HOME%\lib\servlet-api.jar"
if not defined CP if exist "%CATALINA_HOME%\lib\jakarta.servlet-api.jar" set "CP=%CATALINA_HOME%\lib\jakarta.servlet-api.jar"
if not defined CP if exist "C:\Program Files\Apache Software Foundation\Tomcat 11.0\lib\servlet-api.jar" set "CP=C:\Program Files\Apache Software Foundation\Tomcat 11.0\lib\servlet-api.jar"
if not defined CP if exist "C:\apache-tomcat-11.0.24\lib\servlet-api.jar" set "CP=C:\apache-tomcat-11.0.24\lib\servlet-api.jar"

if not defined CP (
  echo Downloading Jakarta Servlet API 6.1 for compile only...
  powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -Uri 'https://repo1.maven.org/maven2/jakarta/servlet/jakarta.servlet-api/6.1.0/jakarta.servlet-api-6.1.0.jar' -OutFile 'lib\jakarta.servlet-api.jar' } catch { exit 1 }"
  if exist "lib\jakarta.servlet-api.jar" set "CP=lib\jakarta.servlet-api.jar"
)

if not defined CP (
  echo Could not find servlet-api.jar. Install Tomcat 11 and set CATALINA_HOME, then run compile.bat again.
  exit /b 1
)

echo Using API: %CP%
echo Compiling src\*.java for Java 21 / Tomcat 11 ...
javac --release 21 -encoding UTF-8 -cp "%CP%" -d WEB-INF\classes src\*.java
if errorlevel 1 (
  echo Compile failed.
  exit /b 1
)
echo OK. Classes are in WEB-INF\classes
echo Copy this folder into Tomcat webapps\basic-servlets and open http://localhost:8080/basic-servlets/
endlocal
