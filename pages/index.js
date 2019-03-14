import {Component, Fragment} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Debug from '../components/Debug';
import Snakes from '../components/Snakes';
import SnakesGame from '../lib/SnakesGame';

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
    font-size: 2rem;
`;

const QRCode = styled.img`  
    width: 150px;
    height: auto;  
`;

const Line = styled.div.attrs({
    style: props => ({
        transform: `rotate(${props.rotation}deg)`
    }),
})`
    width: 0;
    height: 10vw;
    border: solid 1px #000;
    margin: 5vw auto;
    transform-origin: 50% 100%;
    transition: transform 0.2s;
`;

export default class extends Component {
    state = {
        rotation: 0,
        log: [],
    };

    static async getInitialProps({query, res, req}) {
        if (query && query.hasOwnProperty && query.hasOwnProperty('code')) {
            return {
                code: query.code,
                path: req.protocol + '://' + req.headers.host + req.url.replace('room', 'player'),
            }
        } else {
            const code = 'snakes';
            if (res) {
                res.writeHead(302, {
                    Location: '/room/' + code
                });
                res.end();
            } else {
                Router.push('/room/' + code);
            }
            return {};
        }
    }

    render() {
        const {code, path} = this.props;

        return (
            <Fragment>
                <Header>
                    <div>
                        <Heading>Room: {code}</Heading>
                        <p>Otevři v mobilu <span>{path}</span></p>
                    </div>
                    <QRCode src={'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + path}/>
                </Header>
                <Snakes/>
            </Fragment>
        );
    }
}
