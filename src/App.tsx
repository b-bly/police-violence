import React, { Component } from 'react';
import { Graph } from './screens/Graph';
import './App.css';
import { calculateMapWidth, calculateMapHeight } from './/utility';

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

    calculateFontSize() {
        const aspectRatio = 670 / 505;
        return this.state.width > (this.state.height * aspectRatio) ? (this.state.height * 1.1) / 11 : this.state.width / 11;
    }

    // 354
    calculateBackgroundTextWidth() {
        const mapWidth = calculateMapWidth(this.state.height);
        if (this.state.width < 767) {
            return '100%';
        } else if (mapWidth >= this.state.height) { 
            return this.state.width - 200;
        }  
        return mapWidth;
    }
    render() {
        const backgroundTextStyle = {
            height: this.state.width / 1.6,
            width: this.calculateBackgroundTextWidth(), //this.state.width - 200, // 200 = max width of legend
            fontSize: this.calculateFontSize(), // this.state.width /11,
            maxHeight: calculateMapHeight(this.state.height) + "px",
        }

        return (
            <div>
                {this.state.loading === false &&
                    <div className="background-text" style={backgroundTextStyle}>
                        <div>I can't breathe</div>

                    </div>
                }

                <Graph
                    width={this.state.width}
                    height={this.state.height}
                    loading={this.state.loading}
                    setLoading={this.setLoading}
                />
            </div>
        );
    }
}