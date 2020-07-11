import React, { Component } from 'react';
import { Graph } from './screens/Graph';

interface AppProps {

}

interface AppState {
    width: number,
    height: number
}

export default class App extends Component<AppProps, AppState> {
    constructor() {
        super({});
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    render() {
        return (
            <div>
                <Graph width={this.state.height} height={this.state.width} />
            </div>
        );
    }
}