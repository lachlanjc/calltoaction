const fs = require('fs')
const forEach = require('lodash/forEach')

const govData = JSON.parse(
  fs.readFileSync('./data/people.json', 'utf8')
)

const imgRoot = 'https://theunitedstates.io/images/congress';
const smallImgDimensions = '225x275'
const largeImgDimensions = '450x550'

let people = []

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

  const bioGuideId = person.person.bioguideid

  person.photos = {
    small: `${imgRoot}/${smallImgDimensions}/${bioGuideId}.jpg`,
    large: `${imgRoot}/${largeImgDimensions}/${bioGuideId}.jpg`,
  }

  people.push(person)
})

fs.writeFile('./data/people.json', JSON.stringify(people), err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`✅ Saved people (${people.length})`)
  }
})