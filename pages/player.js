import Head from 'next/head';
import {Component, Fragment} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const Header = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 2%;
    
    >div {
        width: calc(100% - 200px);    
    }
`;

const Heading = styled.h1`
`;

const Button = styled.span`
    display: inline-block;
    padding: 1vw;
    border: solid 2px #abc;
    border-radius: 50%;
    cursor: pointer;
    margin: 1vw;
    width:42vw;
    height:42vw;
    font-size:10vh;
    -webkit-user-select: none;
    
    &:before {
        content: '${props => props.content}';
        position: relative;
        left: 16vw;
        top: 12vw;
    }
`;

export default class extends Component {
    static async getInitialProps({query, res, req}) {
        return {
            code: query.code,
        }
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('connect', () => {
            console.log('emitting join');
            this.socket.emit('join_game', this.props.code);
        });
    }

    componentDidUpdate() {
        window.clearInterval(this.leftInterval);
        window.clearInterval(this.rightInterval);
    }

    clean() {
        window.clearInterval(this.leftInterval);
        window.clearInterval(this.rightInterval);
    }

    sendLeft(e) {
        e.stopPropagation();
        this.clean();
        this.leftInterval = window.setInterval(() => {
            this.socket.emit('left', this.props.code);
        }, 20);
    }

    stopSendLeft(e) {
        e.stopPropagation();
        window.clearInterval(this.leftInterval);
    }

    sendRight(e) {
        e.stopPropagation();
        this.clean();
        this.rightInterval = window.setInterval(() => {
            this.socket.emit('right', this.props.code);
        }, 20);
    }

    stopSendRight(e) {
        e.stopPropagation();
        window.clearInterval(this.rightInterval);
    }

    render() {
        const {code, path} = this.props;

        return (
            <Fragment>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                </Head>
                <Header>
                    <Heading>Room: {code}</Heading>
                </Header>
                <Button content='<' onTouchStart={(e) => this.sendLeft(e)} onTouchEnd={(e) => this.stopSendLeft(e)}></Button>
                <Button content='>' onTouchStart={(e) => this.sendRight(e)} onTouchEnd={(e) => this.stopSendRight(e)}></Button>
            </Fragment>
        );
    }
}