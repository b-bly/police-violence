import React, { Component } from 'react'
import { calculateMapWidth, calculateMapHeight } from '../utility';
import { Graph } from './Graph';
import './Home.css';
import { Link } from 'react-router-dom';

interface HomeState {
  width: number,
  height: number,
  loading: boolean
}

interface HomeProps {

}

export class Home extends Component<HomeProps, HomeState>{
  constructor(props: HomeProps) {
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
        <Graph
          width={this.state.width}
          height={this.state.height}
          loading={this.state.loading}
          setLoading={this.setLoading}
        />
        <Link to="/about"
          className="about"
        >About</Link>
      </div>
    );
  }
}