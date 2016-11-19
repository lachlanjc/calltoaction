/**
 * This is a script that generates static React class files for two 
 * different scenarios:
 *
 * 	1. A state page that displays all the congressmen in that
 * 	   state.
 * 	2. A district page that displays all the congressmen in that
 * 		 district (typically based on full address).
 */
const React = require('react');
const fs = require('fs');
const forEach = require('lodash/forEach');
const forOwn = require('lodash/forOwn');
const syncExec = require('sync-exec');

const govData = JSON.parse(
	fs.readFileSync('./data/people.json', 'utf8')
);

// Loop through the government data and start to sort them by
// state and district.
let congressByStateAndDistrict = {};

forEach(govData, function(person) {
	if (!person.current) {
		console.log(`${person.person.name} is not a current worker in government.`);
		return;
	}

	// If this isn't a congressman with a district, it is likely a Senator.
	// We don't want to deal with Senator data just yet.
	if (!person.district) {
		console.log(`${person.person.name} is not a Congressman.`);
		return;
	}

	let district = parseInt(person.district, 10);
	if (isNaN(district)) {
		console.log(`District ${district} is not numeric`);
		return;
	}

	let state = person.state;

	// Add this person object to the associated location in the
	// congressByStateAndDistrict object.
	if (!congressByStateAndDistrict[state]) {
		congressByStateAndDistrict[state] = [];
	}

	congressByStateAndDistrict[state][district] = person;
}); 

console.log('Finished breaking down congressmen by district and state.');
console.log('Now attempting to generate a Root react component file dynamically based on states and districts.');

// Create a react root component file that can be made into HTML with
// contextual data.
const classString = 
`var React = require('react');

class Root extends React.Component {
  render () {
    return (
      <html>
        <head>
        	<title>Call to Action</title>
        </head>
        <body>
          <State />
          <District />
          <Congressman />
          <Party />
        </body>
      </html>
    )
  }
}

export default Root;`;

var districtFiles = [];

// First create the specific district classes.
forOwn(congressByStateAndDistrict, function(districts, state) {
	let localClassString = classString;

	localClassString = localClassString.replace('<State />', state);

	for (var i = 0; i < districts.length; i++) {
		if (!districts[i]) {
			continue;
		}

		let person = districts[i];
		let districtClassString = localClassString;

		districtClassString = districtClassString.replace('<District />', person.description);
		districtClassString = districtClassString.replace('<Congressman />', `${person.person.firstname} ${person.person.lastname}`);
		districtClassString = districtClassString.replace('<Party />', person.party);

		var fileName = `${state}-${i}.js`;

		fs.writeFileSync(`./build/${fileName}`, districtClassString);
	}
});






