# Resume Parser with Express JS

## Usage
1. clone this repo
2. npm install
- Copy `.env.example` to `.env`
- Update your `.env` with your needs
3. node app.js
4. open postman or curl, I prefer using postman
5. direct to http://localhost:3000/parse/resume with request (raw, type : application/json)
```
{
    "filename":"your_file_resume.docx"
}
```

## Used packages
1. express
2. body-parser
3. resume-parser, others
