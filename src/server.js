import fs from 'fs'
import express from 'express'
import multer from 'multer'
import moment from 'moment'

moment.locale('ja')

const getDate = filename => {
	const array = filename.replace('.webm', '').split('-')
	return {
		year: array[0],
		month: array[1],
		day: array[2],
		hour: array[3],
		minute: array[4],
		second: array[5]
	}
}

const app = express()
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/videos')
	},
	filename: (req, file, cb) => {
		const time = moment().format('YYYY-MM-DD-HH-mm-ss')
		cb(null, time + '.webm')
	}
})
const upload = multer({ storage: storage })

app
	.use(express.static('public'))
	.get('/', (req, res, next) => {
		res.send("Hello")
	})
	.post('/upload', upload.single('video'), (req, res) => {
		res.send('Success')
	})
	.get('/list', (req, res, next) => {
		fs.readdir('public/videos', (err, files) => {
			if (err) throw err
			res.json(files.map(filename => {
				return {
					filename: filename,
					date: getDate(filename)
				}
			}))
		})
	})
	.listen(3000, () => {
		console.log("URL -> http://localhost:3000")
	})