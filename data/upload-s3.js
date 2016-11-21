
const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const bucketName = 'usecalltoaction'
const awsKey = 'AKIAIKIYIMA2ZJ7VKS4A'

const files = fs.readdirSync('./dist')
const filesLength = files.length
console.log(`Files Length: ${filesLength}`)

const baseCallToActionBucketParams = {
  Bucket: bucketName,
  ACL: 'public-read'
}

for (let i = 0; i < filesLength; i++) {
  const fileNum = i + 1
  console.log(`File #${fileNum} of ${filesLength}`)

  const fileName = files[i]
  const fileContent = fs.readFileSync(`./dist/${fileName}`, 'utf8')

  const fileUploadParams = Object.assign({}, baseCallToActionBucketParams, {
    Key: fileName,
    Body: fileContent
  })

  console.log(fileUploadParams)

  s3.putObject(fileUploadParams, (err, data) => {
    if (err) {
      console.log(`${fileName} failed to be uploaded to S3.`)
      console.error(err, err.stack)
    } else {
      console.log(`${fileName} successfully uploaded to S3.`)
      console.log(data)
    }
  })
}

// NOTE! When running this for a fresh deploy, invalidate the CloudFront
// file caching through the UI. Contact Mitul if you don't know how to do
// this. We'll get this done programmatically soon.
