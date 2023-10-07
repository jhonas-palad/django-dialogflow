# Chatbot with Dialogflow

## Table of contents

- [About](#about)
- [Usage](#usage)
- [License](#license)

## About
Welcome to the University Chatbot, your gateway to intelligent assistance for all university-related inquiries and services.

## Usage
This section provides an overview of how to use the Websocket endpoint effectively.

### Base URL
To get started, make requests to the following base URL:
```
To be deployed
```

### Connecting to websocket endpoint
Interact with the University Chatbot using standard Websocket protocol. Below is the common ws endpoints and their inteded usage:

#### 1. Querying the chatbot
**Endpoint:** `/ws/chatbot/<session_id>/`

<!-- **Method:** `POST` -->

**Description:** `session_id` is a unique id that is used to send in dialog flow session client, it can be any string. Use this endpoint to send user queries to the chatbot and receive responses. The example message format should be in JSON format

**Example message format**:
```
{
    "message": "What are the admission requirements for the Information Technology program?"
}
```
**Example response format**:
```
{
    "response_id": "8b9ec1a4-aad5-4ff2-9d5a-eef6722239e9-afbcf665",
    "fulfillment_text": "The admission requirements for the Information Technology program include ..."
}
```

## License
The License section of this README provides important information about the terms and conditions governing the use, modification, and distribution of this project's source code and associated assets.

**Why Licensing Matters**

Licensing ensures that creators can protect their work while allowing others to use, modify, and share it under specific conditions. Understanding the project's license is crucial for developers, contributors, and users to know what they can and cannot do with the codebase.

**License Type**: MIT License

**Questions or Concerns**

If you have any questions or concerns regarding the project's license or its usage, please reach me out.







