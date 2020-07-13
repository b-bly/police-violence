import React, { Component } from 'react';
import { Graph } from './screens/Graph';
import './App.css';

interface AppProps {

}

interface AppState {
    width: number,
    height: number,
    loading: boolean
}

export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            loading: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.setLoading = this.setLoading.bind(this);
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

    setLoading(isLoading: boolean) {
        this.setState({
            loading: isLoading
        });
    }
    render() {
        const backgroundTextStyle = { 
            height: this.state.height / 1.3, 
            width: this.state.width - 143,
            fontSize: this.state.width /10
         }
        return (
            <div>
                {this.state.loading === false &&
                    <div className="background-text" style={backgroundTextStyle}>
                        <div>I can't breathe</div>

                    </div>
                }

                <Graph
                    width={this.state.height}
                    height={this.state.width}
                    loading={this.state.loading}
                    setLoading={this.setLoading}
                />
            </div>
        );
    }
}