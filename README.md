# Barco Telnet Client

Barco Telnet Client is a Node.js module for communicating with Barco projectors using the Telnet protocol. It provides an easy-to-use interface for sending commands, maintaining connections, and implementing a heartbeat mechanism.

## Features

- Establish a Telnet connection with Barco projectors.
- Send commands and receive responses.
- Automatic heartbeat mechanism to keep the connection alive.
- Automatic reconnection in case of connection loss.

## Installation

To use the Barco Telnet Client, first install it using npm:

```bash
npm install barco-telnet-client
```

## Usage

### Importing the Module

```javascript
const { BarcoTelnetClient } = require('barco-telnet-client');
```

### Creating a Client Instance

```javascript
const client = new BarcoTelnetClient('192.168.1.100', 3023); // Replace with your projector's IP and port
```

### Connecting to the Projector

```javascript
client.connect()
    .then(() => {
        console.log('Successfully connected to the projector!');
    })
    .catch((error) => {
        console.error('Failed to connect:', error);
    });
```

### Sending Commands

```javascript
client.sendCommand('COMMAND_STRING')
    .then((response) => {
        console.log('Projector response:', response);
    })
    .catch((error) => {
        console.error('Error sending command:', error);
    });
```

### Handling Connection Loss

The client automatically attempts to reconnect after a disconnection. You can monitor the logs for reconnection attempts.

### Heartbeat Mechanism

The heartbeat mechanism is automatically started upon connection. It sends a harmless `NOOP` command every 30 seconds (configurable).

## API Reference

### Constructor

```javascript
new BarcoTelnetClient(ip, port = 3023, heartbeatInterval = 30000)
```

- **ip**: The IP address of the Telnet server.
- **port**: (Optional) The port number of the Telnet server. Default is 3023.
- **heartbeatInterval**: (Optional) The interval for the heartbeat in milliseconds. Default is 30,000 ms.

### Methods

#### `connect()`

Establishes a connection to the Telnet server.

Returns:

- `Promise<void>`: Resolves when the connection is established.

#### `sendCommand(command)`

Sends a command to the Telnet server.

Parameters:

- **command**: The command string to send.

Returns:

- `Promise<string>`: Resolves with the response from the server.

#### `startHeartbeat()`

Starts the heartbeat mechanism. (Automatically called after connecting.)

#### `stopHeartbeat()`

Stops the heartbeat mechanism.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

Developed by [Tyler-Franklin](https://github.com/Tyler-Franklin).

Feel free to contribute, report issues, or suggest improvements on the [GitHub repository](https://github.com/Tyler-Franklin/barco-telnet-client).
