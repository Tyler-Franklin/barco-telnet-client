/**
 * TelnetClient for communicating with Barco Projector via Telnet protocol.
 * Uses Node.js 'net' module to establish and manage connections.
 */

const net = require('net');

class BarcoTelnetClient {
    /**
     * @param {string} ip - IP address of the Telnet server.
     * @param {number} [port=3023] - Port number of the Telnet server.
     * @param {number} [heartbeatInterval=30000] - The interval for the heartbeat in milliseconds.
     */
    constructor(ip, port = 3023, heartbeatInterval = 30000) {
        this.ip = ip;
        this.port = port;
        this.client = null;
        this.heartbeatInterval = heartbeatInterval;
        this.reconnectDelay = 1000; // 1 seconds
    }

    /**
     * Connects to the Telnet server.
     * @returns {Promise<void>} Resolves when the connection is established.
     */
    async connect() {
        return new Promise((resolve, reject) => {
            this.client = new net.Socket();

            this.client.connect(this.port, this.ip, () => {
                console.log('Connected to projector at', this.ip, 'on port', this.port);
                this.startHeartbeat();
                resolve();
            });

            this.client.on('close', (hadError) => {
                console.log(hadError ? 'Connection closed due to an error' : 'Connection closed normally');
                this.stopHeartbeat();
                this.reconnect();
            });

            this.client.on('error', (err) => {
                console.error('Connection error:', err);
                this.client.destroy();
            });
        });
    }

    /**
     * Sends a command to the Telnet server.
     * @param {string} command - Command to send.
     * @returns {Promise<string>} Resolves with the response from the server.
     */
    async sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject(new Error('Not connected to projector'));
            }

            this.client.once('data', (data) => {
                resolve(data.toString());
            });

            this.client.write(command);
        });
    }

    /**
     * Starts the heartbeat mechanism, sending a harmless query every 30 seconds.
     */
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.sendCommand('NOOP')
                .then(response => {
                    console.log('Projector Telnet Heartbeat response:', response);
                })
                .catch(err => {
                    console.error('Heartbeat error:', err);
                });
        }, this.heartbeatInterval);
    }

    /**
     * Stops the heartbeat mechanism.
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Attempts to reconnect to the Telnet server after a delay.
     */
    reconnect() {
        setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect().catch((err) => {
                console.error('Reconnection failed:', err);
            });
        }, this.reconnectDelay);
    }
}

module.exports = {
    BarcoTelnetClient
}