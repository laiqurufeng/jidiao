
@ECHO OFF
Echo Auto-sign Created By Dave Da illest 1 
Echo Update.zip is now being signed and will be renamed to update_signed.zip

set PATH=%CD%;%PATH%;

java -jar "%~dp0\signapk.jar" testkey.x509.pem testkey.pk8 %1  signed.apk

Echo Signing Complete 
 
Pause
EXIT