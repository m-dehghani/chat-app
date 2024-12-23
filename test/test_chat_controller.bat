@echo off
setlocal EnableDelayedExpansion

:: Base URL of the API
set BASE_URL=http://localhost:4000/chat

:: Create a chat room
echo Creating chat room...
echo Creating chat room... for /f "delims=" %%i in ('curl -X POST "%BASE_URL%/room" -H "Content-Type: application/json" -d "{\"name\": \"Test Room\"}" ^| jq -r ".id"') do set ROOM_ID=%%i echo Room ID: %ROOM_ID% echo.
:: Join a chat room
echo Joining chat room...
curl -X POST "%BASE_URL%/room/someid/join" -H "Content-Type: application/json" -d "{\"userId\": \"507f191e810c19729de860ea\"}"
echo.

:: Send a message
echo Sending message...
curl -X POST "%BASE_URL%/message" -H "Content-Type: application/json" -d "{\"roomId\": \"507f1f77bcf86cd799439011\", \"userId\": \"507f191e810c19729de860ea\", \"author\": \"Author\", \"content\": \"Test message\"}"
echo.

:: Update a message
echo Updating message...
curl -X PUT "%BASE_URL%/message/someid" -H "Content-Type: application/json" -d "{\"userId\": \"507f191e810c19729de860ea\", \"content\": \"Updated message\"}"
echo.

:: Delete a message
echo Deleting message...
curl -X DELETE "%BASE_URL%/message/someid" -H "Content-Type: application/json" -d "{\"userId\": \"507f191e810c19729de860ea\"}"
echo.

:: Get messages from a chat room
echo Getting messages...
curl -X GET "%BASE_URL%/messages/someid" -H "Content-Type: application/json" -d "{\"userId\": \"507f191e810c19729de860ea\"}"
echo.

echo All tests completed.
pause
