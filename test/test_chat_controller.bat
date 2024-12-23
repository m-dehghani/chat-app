@echo off
setlocal EnableDelayedExpansion

:: Base URL of the API
set BASE_URL=http://localhost:4000/chat

:: User ID
set USER_ID=507f1f77bcf86cd799439011

:: Create a chat room and save roomId
 echo Creating chat room...
  for /f "tokens=*" %%i in ('curl -X POST "%BASE_URL%/room" -H "Content-Type: application/json" -d "{\"name\": \"Test Room\"}" ^| jq -r "_id"') do set ROOM_ID=%%i
 echo Room ID: %ROOM_ID%
echo.

:: Join a chat room
echo Joining chat room...
curl -X POST "%BASE_URL%/room/%ROOM_ID%/join" -H "Content-Type: application/json" -d "{\"userId\": \"%USER_ID%\"}"
echo.

:: Send a message and save messageId
echo Sending message...
for /f "tokens=*" %%i in ('curl -X POST "%BASE_URL%/message" -H "Content-Type: application/json" -d "{\"roomId\": \"%ROOM_ID%\", \"userId\": \"%USER_ID%\", \"author\": \"Author\", \"content\": \"Test message\"}" ^| jq -r ".messageId"') do set MESSAGE_ID=%%i
echo Message ID: %MESSAGE_ID%
echo.

:: Update a message
echo Updating message...
curl -X PUT "%BASE_URL%/message/%MESSAGE_ID%" -H "Content-Type: application/json" -d "{\"userId\": \"%USER_ID%\", \"content\": \"Updated message\"}"
echo.

:: Delete a message
echo Deleting message...
curl -X DELETE "%BASE_URL%/message/%MESSAGE_ID%" -H "Content-Type: application/json" -d "{\"userId\": \"%USER_ID%\"}"
echo.

:: Get messages from a chat room
echo Getting messages...
curl -X GET "%BASE_URL%/messages/%ROOM_ID%" -H "Content-Type: application/json" -d "{\"userId\": \"%USER_ID%\"}"
echo.

echo All tests completed.
pause
