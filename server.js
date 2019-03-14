import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import next from 'next';

const app = express();
const server = http.Server(app);
const io = socketio(server);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

let games = {};

io.on('connect', socket => {
    socket.on('game', function(game) {
        console.log('game creation ' + game + ' (' + socket.id + ')');
        games[game] = socket;
        socket.join(game);
    });

    socket.on('join_game', function(game) {
        if (games.hasOwnProperty(game)) {
            console.log(socket.id + ' joining ' + game + ' (' + games[game].id + ')');
            socket.join(game);
            socket.emit('join_player', socket.id);
            io.to(games[game].id).emit('join_player', socket.id);
        }
    });
    socket.on('left', function(game) {
        if (games.hasOwnProperty(game)) {
            games[game].emit('left', socket.id);
        }
    });

    socket.on('right', function(game) {
        if (games.hasOwnProperty(game)) {
            games[game].emit('right', socket.id);
        }
    });

    socket.on('player', function(player) {
        console.log('player', player);
        socket.emit('player', player);
    });
});

io.on('disconnect', socket => {
    io.to(games[game].id).emit('delete_player', socket.id);
});

nextApp.prepare().then(() => {
    app.get('/player/:code', (req, res) => {
        return nextApp.render(req, res, '/player', req.params);
    });

    app.get('/room/:code', (req, res) => {
        return nextApp.render(req, res, '/', req.params);
    });

    app.get('*', (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});