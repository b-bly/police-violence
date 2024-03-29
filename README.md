# Police Violence

This app visualizes the data collected by the group fatalencounters.org.  It's meant to help spread awareness about police violence, and the disproportionate deaths of blacks in police encounters.

![app picture](/public/data/police-violence.png)

Link to the live app: [police-violence](http://police-violence.herokuapp.com/)

## Built With

ReactJS, Typescript, Node.js.

## Getting Started

### Prerequisites

- A package manager like [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)
- [nodemon](https://www.npmjs.com/package/nodemon)


### Installing

Run these commands in the terminal:

```
npm install

npm run dev
```

The app should automatically open in a browser at the url: localhost:3000

## Environment

Get a US Census api key from https://api.census.gov/data/key_signup.html

Create a file called `.env` in the `server/` directory and add this variable

```
CENSUS_KEY=<your key value>
```

### Completed Features

- [x] Map data for deaths by state and county.
- [x] Map data for risk.
- [x] User filters for location, cause of death and year.

### Next Steps

- [ ] Bar graphs of locations with highest deaths.
- [ ] Filter for race.

## Author

Brendt Bly


## Acknowledgments

My thanks to the people maintaining the fatalencounters.org database, and people contributing to the US Census data.