@REM Maven Wrapper script for Windows
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MAVEN_WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar") ELSE (SET "MAVEN_WRAPPER_JAR=%MAVEN_WRAPPER_PROPERTIES%")
@IF "%JAVA_HOME%"=="" (@ECHO Error: JAVA_HOME is not set. & GOTO error)
@java.exe -jar "%~dp0.mvn\wrapper\maven-wrapper.jar" %*
