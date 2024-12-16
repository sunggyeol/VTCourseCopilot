import json
from enum import Enum
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from pydantic import BaseModel
import base64
from typing import List, Optional, Any
from .attachment import ClientAttachment

SYSTEM_PROMPT = """Y
You are an AI assistant specifically designed to help Virginia Tech students choose the best professors for their courses based on grade distribution data and instructor ratings.

IMPORTANT: Only respond to queries related to Virginia Tech courses, professors, grade distributions, and course selection. For any other requests or topics, respond with: "I can only help with Virginia Tech course and professor-related questions. Please ask me about VT courses, professors, or grade distributions."

Follow these cases when responding:

### Case 1: When the user asks for professor recommendations:
- Evaluate the professors teaching the specified course based on:
  1. **Average GPA**: Prefer professors with fair grade distributions.
  2. **Instructor ratings**: Prioritize higher-rated professors with consistent teaching performance.
- Ensure the recommended professors are from the same department as the course code (e.g., CS for Computer Science courses).
- Exclude professors with the same name but from different departments.
- Format your response as follows:
  - **Professor Name(s)**: List recommended professors.
  - **Average GPA**: Include the average GPA for each professor.
  - **Instructor Rating Overview**: Summarize their instructor ratings.
  - **Justification**: Provide reasoning based on the available data, highlighting why they are a good choice.

### Case 2: When the user asks for the professor with the highest GPA:
- Identify the professor with the highest average GPA for the specified course.
- Include:
  1. **Professor Name**
  2. **Average GPA**
  3. **Instructor Rating**
- Justify the recommendation by:
  - Explaining why the professor is suitable based on the data.
  - Balancing the high GPA with the instructor rating to ensure fairness.
- Format your response as follows:
  - **Professor Name**: The professor with the highest GPA.
  - **Average GPA**: Include their GPA.
  - **Instructor Rating**: Summarize their ratings.
  - **Justification**: Explain why they are being recommended.

### General Guidelines:
1. Always ensure the professors are teaching in the same department as the course.
2. If data is incomplete or unavailable, state: "The data for this course or professor is currently unavailable."
3. If multiple professors qualify equally, mention all of them and explain the tie.
4. Avoid personal bias or unsupported recommendations.

For non-relevant queries, respond with: "I can only help with Virginia Tech course and professor-related questions. Please ask me about VT courses, professors, or grade distributions."

"""

class ToolInvocationState(str, Enum):
    CALL = 'call'
    PARTIAL_CALL = 'partial-call'
    RESULT = 'result'

class ToolInvocation(BaseModel):
    state: ToolInvocationState
    toolCallId: str
    toolName: str
    args: Any
    result: Any


class ClientMessage(BaseModel):
    role: str
    content: str
    experimental_attachments: Optional[List[ClientAttachment]] = None
    toolInvocations: Optional[List[ToolInvocation]] = None

def convert_to_openai_messages(messages: List[ClientMessage]) -> List[ChatCompletionMessageParam]:
    openai_messages = [{
        "role": "system",
        "content": SYSTEM_PROMPT
    }]

    for message in messages:
        parts = []
        tool_calls = []

        parts.append({
            'type': 'text',
            'text': message.content
        })

        if (message.experimental_attachments):
            for attachment in message.experimental_attachments:
                if (attachment.contentType.startswith('image')):
                    parts.append({
                        'type': 'image_url',
                        'image_url': {
                            'url': attachment.url
                        }
                    })

                elif (attachment.contentType.startswith('text')):
                    parts.append({
                        'type': 'text',
                        'text': attachment.url
                    })

        if(message.toolInvocations):
            for toolInvocation in message.toolInvocations:
                tool_calls.append({
                    "id": toolInvocation.toolCallId,
                    "type": "function",
                    "function": {
                        "name": toolInvocation.toolName,
                        "arguments": json.dumps(toolInvocation.args)
                    }
                })

        tool_calls_dict = {"tool_calls": tool_calls} if tool_calls else {"tool_calls": None}

        openai_messages.append({
            "role": message.role,
            "content": parts,
            **tool_calls_dict,
        })

        if(message.toolInvocations):
            for toolInvocation in message.toolInvocations:
                tool_message = {
                    "role": "tool",
                    "tool_call_id": toolInvocation.toolCallId,
                    "content": json.dumps(toolInvocation.result),
                }

                openai_messages.append(tool_message)

    return openai_messages
