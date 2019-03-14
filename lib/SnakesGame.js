import Game from './Game';

const ROOM_NAME = 'snakes';
const ROTATION_INCREMENT = 5;

export default class SnakesGame extends Game {

    /**
     * Start timestamp
     * @type {integer}
     */
    start = null;

    /**
     * Start timestamp
     * @type {integer}
     */
    last = null;

    /**
     * Interval resource
     * @type {resource}
     */
    interval = null;

    static width = 800;
    static height = 400;

    constructor(socket, addCallback, updateCallback) {
        super(socket, ROOM_NAME);
        this.addCallback = addCallback;
        this.updateCallback = updateCallback;
    }

    addPlayer(id) {
        const player = super.addPlayer(id);

        // add custom attributes
        Object.assign(player, {
            color: this.getRandomColor(),
            path: [{x: 200, y: 200}],
            rotation: 0,
            alive: true,
        });

        this.addCallback(super.players);

        if (!this.interval) {
            this.startTimer();
        }

        return player;
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    onLeft(id) {
        try {
            const player = this.getPlayer(id);
            player.rotation -= ROTATION_INCREMENT;
            this.updateCallback(super.players);
        } catch (e) {
        }
    }

    onRight(id) {
        try {
            const player = this.getPlayer(id);
            player.rotation += ROTATION_INCREMENT;
            this.updateCallback(super.players);
        } catch (e) {
        }
    }

    startTimer() {
        this.interval = window.setInterval(() => this.step(), 20);
        this.last = window.performance.now();
    }

    stopTimer() {
        window.clearInterval(this.interval);
        this.interval = null;
    }

    step() {
        const now = window.performance.now();
        this.start = this.start || now;
        const progress = (now - this.start) / 1000; // time in seconds
        const delta = (now - this.last) / 1000; // time in seconds
        const speed = 20 + Math.min(50, progress);
        let sendAddCallback = false;
        super.players = super.players.map(player => {
            if (player && player.alive) {
                const newX = player.path[player.path.length - 1].x + Math.cos(player.rotation / 180 * Math.PI) * speed * delta;
                const newY = player.path[player.path.length - 1].y + Math.sin(player.rotation / 180 * Math.PI) * speed * delta;
                let alive = true;

                if (newX < 0 || newY < 0 || newX >= this.width || newY >= this.height) {
                    alive = false;

                    this.checkAllPlayersDead();
                }

                if (alive !== player.alive) {
                    sendAddCallback = true;
                }

                player.path.push({x: newX, y: newY});
                player.alive = alive;

                return player;
            }
        });
        this.updateCallback(super.players);
        sendAddCallback && this.addCallback(super.players);
        this.last = now;
    }

    checkAllPlayersDead() {

    }
}
