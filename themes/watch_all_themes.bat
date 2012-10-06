@echo off

for /d %%d in ("*.theme") do (
    cd %%d\sass
    start /min cmd /c compass watch %1
    cd ..\..
)
