from google.cloud.dialogflow import SessionsAsyncClient, TextInput, QueryInput, DetectIntentRequest, DetectIntentResponse
from uuid import uuid4
import os
from django.conf import settings
from django.core import exceptions

if not hasattr(settings, 'DIALOGFLOW'):
    raise exceptions.ImproperlyConfigured("DIALOGFLOW is not defined in Django settings")

PROJECT_ID = settings.DIALOGFLOW['PROJECT_ID']
async def start_session(session_id: str = None) -> SessionsAsyncClient:
    if 'GOOGLE_APPLICATION_CREDENTIALS' not in os.environ:
        os.environ.setdefault('GOOGLE_APPLICATION_CREDENTIALS', 'dialogflow-credentials.json')
    session_client = SessionsAsyncClient()
    session_id = session_id or str(uuid4())
    session = session_client.session_path(project=PROJECT_ID, session=session_id)
    session_client.session = session
    return session_client

async def send_query(text:str, session_client: SessionsAsyncClient):
    if len(text) > 256:
        text = text[:256]
    session_path = session_client.session
    text_query = TextInput(text = text, language_code = "en")
    query_input = QueryInput(text=text_query)
    request = DetectIntentRequest(
        session= session_path,
        query_input=query_input
    )
    response : DetectIntentResponse = await session_client.detect_intent(request=request)
    return response