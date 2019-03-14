import io from 'socket.io-client';

let instance = null;

let isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

export default class Connection {
    constructor(room) {
        this.listeners = new Map();
        this.socket = io();
        this.socket.on('connect', () => {
            this.socket.emit('room', 'room' + room);
        });
    }

    static getInstance(room) {
        if (!instance) {
            instance = new Connection(room);
        }
    }

    bindSocketEvents() {
        this.socket.on('left', () => {
            this.emit('event', 'left');
        });

        this.socket.on('right', () => {
            this.emit('event', 'right');
        });
    }

    addListener(label, callback) {
        this.listeners.has(label) || this.listeners.set(label, []);
        this.listeners.get(label).push(callback);
    }

    removeListener(label, callback) {
        let listeners = this.listeners.get(label),
            index;

        if (listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ?
                    i = index :
                    i;
            }, -1);

            if (index > -1) {
                listeners.splice(index, 1);
                this.listeners.set(label, listeners);
                return true;
            }
        }
        return false;
    }

    emit(label, ...args) {
        let listeners = this.listeners.get(label);

        if (listeners && listeners.length) {
            listeners.forEach((listener) => {
                listener(...args);
            });
            return true;
        }
        return false;
    }
}
