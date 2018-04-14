require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const ResumeParser = require('resume-parser')
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Route to /parse/resume
app.post('/parse/resume', (req, res) => {
    const inputDir = process.env.SOURCE_DIR || process.cwd() + '/files/sources/'
    const fileName = req.body.filename
    const outputDir = process.env.OUTPUT_DIR || process.cwd()+'/files/compiled/'

    let customMessage = {}
    let processFailed = false

    // Check request is correct 
    if (!req.body.hasOwnProperty('filename')) {
        processFailed = true
        customMessage = {
            success: false,
            message: 'Bad request.'
        }
    }
    
    // Check file exist
    else if (!fs.existsSync(inputDir + fileName)) {
        processFailed = true
        customMessage = {
            success: false,
            message: 'File not existing.'
        }
    }
    if(processFailed === true) {
        return res
            .status(406)
            .json(customMessage)
    }    

    
    // Resume parsing process
    ResumeParser
        .parseResumeFile(inputDir + fileName, outputDir) //input file, output dir
        .then(file => {
            result = JSON.parse(fs.readFileSync(outputDir + fileName + '.json', 'utf8'))
            
            // Remove compiled file
            const outputFile = outputDir + fileName + '.json';
            if (fs.existsSync(outputFile)) {
                fs.unlink(outputFile, (err) => {
                    if (err) throw err;
                    console.log(outputFile + ' was deleted')
                });
            } else {
                return res
                    .status(200)
                    .json({
                        success: false,
                        message: "Output is failed to generate."
                    })
            }

            // Return OK response
            return res
                .status(200)
                .json({
                    success: true,
                    data: result
                })
        })
        .catch(error => {
            // Return Error response
            console.error(error);
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Something went wrong! X("
                })
        });
})

app.listen(PORT, () => {
    console.log('Server started! Listening on port: '+PORT)
})

module.exports = app