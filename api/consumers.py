import json

from channels.generic.websocket import AsyncWebsocketConsumer
from . import dailogflow_helper as dialogflow
class ChatBotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        session_id = self.scope['url_route']['kwargs']['session_id']
        self.session_client = await dialogflow.start_session(session_id)
        await self.accept()
    async def disconnect(self, close_code):
        # Leave room group
        await self.session_client.transport.close()
        await super().disconnect(close_code)
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if 'message' in data:
                message_content = data['message']
                await self.send_message(message_content)
            else:
                #Send an error if message key is missing
                await self.send(text_data={"error": "Missing message key in JSON data"})
        except json.JSONDecodeError as e:
            err_message = f"Invalid JSON format: {e}"
            await self.send(text_data=json.dumps({"error" : err_message}))
        except Exception as e:
            #TODO:Log the exception in a file
            await self.send(text_data=json.dumps({"error" : "An exception occured"}))

    async def send_message(self, message):
        # Send message to WebSocket
        _response = await dialogflow.send_query(
            text=message,
            session_client=self.session_client
        )
        response = {
            "response_id": _response.response_id,
            "fulfillment_text": _response.query_result.fulfillment_text
        }
        await self.send(text_data=json.dumps(response))