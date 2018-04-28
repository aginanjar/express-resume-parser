require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const ResumeParser = require('resume-parser')
const app = express()
const PORT = process.env.PORT || 3000

//CORS support settings
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Route to /parse/resume
app.post('/parse/resume', (req, res) => {

    const inputDir = process.env.SOURCE_DIR || process.cwd() + '/files/sources/'
    const fileName = req.body.filename
    const outputDir = process.env.OUTPUT_DIR || process.cwd()+'/files/compiled/'
    
    let removeSourceFile = req.body.remove_source_file || false
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
            
            // Remove source file
            console.log('remove source file : '+removeSourceFile)
            if(removeSourceFile)
            {
                const inputFile = inputDir + fileName;
                if (fs.existsSync(inputFile)) {
                    fs.unlink(inputFile, (err) => {
                        if (err) throw err;
                        console.log(inputFile + ' was deleted')
                    });
                } else {
                    return res
                        .status(200)
                        .json({
                            success: false,
                            message: "Input is failed to deleted."
                        })
                }
            }

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
                        message: "Output is failed to deleted."
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
            console.log(error);
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Something went wrong! X("
                })
        });
})

app.listen(PORT, (err) => {
    if(err) console.log("Error happened! "+err)
    console.log('Server started! Listening on port: '+PORT)
})

module.exports = app