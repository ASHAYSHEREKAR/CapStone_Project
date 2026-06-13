@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM Begin all REM://wrapper/scripts. This project uses the Maven Wrapper.
@REM If you do not have Maven installed, this script will download it.

@IF "%__MVNW_ARG0__%"=="" SET __MVNW_ARG0__=%~dpnx0
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE__=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0telecom-field-engineer-system'; $env:MVNW_REPOURL=''; $env:MVNW_USERNAME=''; $env:MVNW_PASSWORD=''; if (!$googlewrapper) { $googlewrapper='false' }; $mavenWrapperJarPath=Join-Path $scriptDir '.mvn\wrapper\maven-wrapper.jar'; $mavenWrapperPropertiesPath=Join-Path $scriptDir '.mvn\wrapper\maven-wrapper.properties'; if (Test-Path $mavenWrapperPropertiesPath) { $distributionUrl=(Get-Content $mavenWrapperPropertiesPath | Select-String 'distributionUrl=').Line -replace 'distributionUrl=',''; $wrapperUrl=(Get-Content $mavenWrapperPropertiesPath | Select-String 'wrapperUrl=').Line -replace 'wrapperUrl=',''; } else { $distributionUrl='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip' }; $mavenHome=Join-Path $env:USERPROFILE '.m2\wrapper\dists'; $distributionUrlName=[System.IO.Path]::GetFileNameWithoutExtension($distributionUrl); $mavenDistDir=Join-Path $mavenHome $distributionUrlName; if (!(Test-Path $mavenDistDir)) { Write-Host 'Downloading Maven...'; New-Item -ItemType Directory -Force -Path $mavenDistDir | Out-Null; $zipPath=Join-Path $mavenDistDir 'maven.zip'; Invoke-WebRequest -Uri $distributionUrl -OutFile $zipPath; Expand-Archive -Path $zipPath -DestinationPath $mavenDistDir -Force; Remove-Item $zipPath }; $mavenBin=Get-ChildItem -Path $mavenDistDir -Filter 'mvn.cmd' -Recurse | Select-Object -First 1; Write-Output \"MVNW_CMD=$($mavenBin.FullName)\"}"`) DO @IF NOT "%%A"=="" SET "%%A=%%B"
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE__%
@IF NOT "%__MVNW_CMD__%"=="" GOTO :exec
@ECHO Could not find Maven installation.
@EXIT /B 1
:exec
@"%__MVNW_CMD__%" %*
