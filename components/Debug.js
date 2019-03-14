import {Component} from 'react';

export default class extends Component {
    static defaultProps = {
        log: [],
    };

    render() {
        const {log} = this.props;

        return (
            <div>
                Log:<br/>
                <textarea rows={20} cols={200} value={log.join('\n')} readOnly={true}></textarea>
            </div>
        );
    }
}
