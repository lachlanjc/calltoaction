
const axios = require('axios')
const fs = require('fs')

axios.get('https://www.govtrack.us/api/v2/role?current=true&limit=540')
  .then(data => {
    fs.writeFile('./data/people.json', JSON.stringify(data.data.objects), err => {
      if (err) {
        console.log(err)
      } else {
        console.log(`✅ Saved people (${data.data.objects.length})`)
      }
    })
  })
