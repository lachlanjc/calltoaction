
const fs = require('fs')
const syncExec = require('sync-exec')

const files = fs.readdirSync('./build')
const filesLength = files.length

console.log(`Files Length: ${filesLength}`)

// Loop through the files and pass them through the static-react
// generator which will output html files. We will place these files
// in the ./data/dist directory.
for (let i = 0; i < filesLength; i++) {
  const fileNum = i + 1
  const fileName = files[i]
  const htmlFileName = fileName.replace('.js', '.html')

  console.log(`File #${fileNum} of ${filesLength}`)

  syncExec(`static-react ./build/${fileName} > ./dist/${htmlFileName}`)
  console.log(`Completed converting ${fileName} to ${htmlFileName}`)
}
