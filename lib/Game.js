import { Map } from 'immutable';
import Player from './Player';

export default class Game {
    players = new Map();

    constructor(socket, name = 'game') {
        this.socket = socket;
        this.name = name;
        this.bindEvents();
    }

    addPlayer(id) {
        console.log('Game addPlayer ' + id);
        const player = new Player(id, 'Player ' + id);
        this.players = this.players.set(id, player);
        return player;
    }

    getPlayer(id) {
        if (this.players.has(id)) {
            return this.players.get(id);
        }

        throw new Error('Player ' + socket.id + ' doesn\'t exist');
    }

    deletePlayer(socket) {
        this.players = this.players.delete(socket.id);
        return this;
    }

    get players() {
        return this.players;
    }

    set players(players) {
        this.players = players;
    }

    bindEvents() {
        this.socket.on('left', (id) => this.onLeft(id));
        this.socket.on('right', (id) => this.onRight(id));
        this.socket.on('join_player', (id) => {
            this.addPlayer(id);
        })
    }

    onLeft(id) {
        throw new Error('onLeft not implemented');
    }

    onRight(id) {
        throw new Error('onRight not implemented');
    }
}
