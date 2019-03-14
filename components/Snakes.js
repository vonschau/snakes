import {Component, Fragment} from 'react';
import io from 'socket.io-client';
import {Map} from 'immutable';
import styled from 'styled-components';
import SnakesGame from '../lib/SnakesGame';

const Players = styled.div`
    padding: 20px;
    background-color: #eee;
    width: 762px;
`;

const Player = styled.div`
    border-bottom: solid 1px #000;
`;

const PlayerName = styled.span`
    color: ${props => props.color};
`;

const PlayerAlive = styled.span`
    color: ${props => props.color};
`;

export default class extends Component {
    state = {
        players: new Map(),
    };

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const socket = io();
        socket.on('connect', () => {
            socket.emit('game', 'snakes');
            this.game = new SnakesGame(socket, players => {
                this.setState({players: players})
            }, players => {
                this.renderCanvas(players);
            });
        });
    }

    render() {
        // this.renderCanvas();

        return (
            <Fragment>
                <canvas ref={this.canvasRef} width={SnakesGame.width} height={SnakesGame.height} style={{border: 'solid 1px #000'}}></canvas>
                <Players>
                    {this.state.players.toArray().map(([id, p]) => p && (
                        <Player key={id}>
                            <PlayerName color={p.color}>{p.name}</PlayerName>
                            {p.alive ? <PlayerAlive color='green'>☻</PlayerAlive> : <PlayerAlive color='red'>x</PlayerAlive>}
                        </Player>
                    ))}
                </Players>
            </Fragment>
        );
    }

    renderCanvas(players) {
        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, SnakesGame.width, SnakesGame.height);

            players.forEach(p => {
                if (p) {
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(~~p.path[0].x, ~~p.path[0].y);
                    for (let i = 1; i < p.path.length; i++) {
                        ctx.lineTo(~~p.path[i].x, ~~p.path[i].y);
                    }
                    ctx.stroke();
                }
            })
        }
    }
}
