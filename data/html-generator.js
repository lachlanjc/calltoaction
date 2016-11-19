const fs = require('fs');
const syncExec = require('sync-exec');

let files = fs.readdirSync('./build');

console.log(`Files Length: ${files.length}`);

// Loop through the files and pass them through the static-react
// generator which will output html files. We will place these files
// in the ./data/dist directory.
const filesLength = files.length;
for (var i = 0; i < filesLength; i++) {
	var fileNum = i + 1;
	console.log(`File #${fileNum} of ${filesLength}`);
	var fileName = files[i];
	let htmlFileName = fileName.replace('.js', '.html');
	syncExec(`static-react ./build/${fileName} > ./dist/${htmlFileName}`);
	console.log(`Completed converting ${fileName} to ${htmlFileName}`);
}