/**
 * This is a script that generates static React class files for two
 * different scenarios:
 *
 *  1. A state page that displays all the congressmen in that
 *     state.
 *  2. A district page that displays all the congressmen in that
 *     district (typically based on full address).
 */
const fs = require('fs')
const forEach = require('lodash/forEach')
const forOwn = require('lodash/forOwn')
const reactClassString = fs.readFileSync('./components/Congressman.js', 'utf8');

const govData = JSON.parse(
  fs.readFileSync('./data/people.json', 'utf8')
)

// Loop through the government data and start to sort them by
// state and district.
let congressByStateAndDistrict = {}

forEach(govData, (person) => {
  if (!person.current) {
    console.error(`${person.person.name} is not a current worker in government.`)
    return
  }

  // If this isn't a congressman with a district, it is likely a Senator.
  // We don't want to deal with Senator data just yet.
  if (!person.district) {
    console.error(`${person.person.name} is not a Congressman.`)
    return
  }

  const district = parseInt(person.district, 10)
  if (isNaN(district)) {
    console.error(`District ${district} is not numeric`)
    return
  }

  const state = person.state

  // Add this person object to the associated location in the
  // congressByStateAndDistrict object.
  if (!congressByStateAndDistrict[state]) {
    congressByStateAndDistrict[state] = []
  }

  congressByStateAndDistrict[state][district] = person
})

console.log('Finished breaking down congressmen by district and state.')
console.log('Now attempting to generate a Root react component file dynamically based on states and districts.')

// First create the specific district classes.
forOwn(congressByStateAndDistrict, (districts, state) => {
  const localClassString = reactClassString.replace('<State />', state)

  for (let i = 0; i < districts.length; i++) {
    if (!districts[i]) {
      continue
    }

    const person = districts[i]
    let districtClassString = localClassString

    const fieldsToReplaceMap = {
      '<District />': person.description,
      '<Congressman />': `${person.person.firstname} ${person.person.lastname}`,
      '<Party />': person.party,
      '<Phone />': person.phone,
    }

    forOwn(fieldsToReplaceMap, (value, replace) => {
      districtClassString = districtClassString.replace(replace, value);
    })

    const fileName = `${state}-${i}.js`
    fs.writeFileSync(`./build/${fileName}`, districtClassString)
  }
})

