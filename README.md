```markdown
# Chatbox API

This project provides an API to interact with a chatbox AI using various models. It is built with Node.js and Express, and uses the `g4f` library for AI interactions.

## Features

- **Chatbox Endpoint**: Allows interaction with the AI using a specified model.
- **Models Endpoint**: Lists all available AI models.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add any necessary environment variables (e.g., `PORT`).

## Usage

### Start the Server

To start the server, run:

```bash
npm start
```

The server will be available at `http://localhost:3000` (or the port specified in the `.env` file).

### Endpoints

#### `/chatbox`

**Method**: `GET`

**Query Parameters**:
- `q` (string): The query to be sent to the AI.
- `uid` (string): A unique identifier for the user.
- `model` (string): The model to be used. Must be one of the available models listed at `/chatbox/models`.
- `cai` (string, optional): Custom prompt to modify the AI's behavior.

**Example Request**:
```
GET /chatbox?q=hello&uid=3773&model=gpt-4&cai=act%20like%20elon%20musk
```

**Response**:
- On success: JSON object with `answer` (string), `snippets` (array of strings), and `author` (string).
- On error: Error message with appropriate HTTP status code.

#### `/chatbox/models`

**Method**: `GET`

**Response**:
- JSON array of available model names.

**Example Response**:
```json
[
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  ...
]
```

## Error Handling

- **400 Bad Request**: Missing required query parameters or invalid model.
- **500 Internal Server Error**: Issues with AI response or other server errors.

## Contributing

Feel free to open issues or submit pull requests. Please ensure to follow the coding standards and test thoroughly.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Kenneth Panio
```
