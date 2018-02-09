import fs from 'fs'
import express from 'express'
import multer from 'multer'
import moment from 'moment'
import https from 'https'

moment.locale('ja')

const options = {
	pfx: fs.readFileSync('src/test.pfx'),
	passphrase: '0000'
}

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
const storagePath = 'videos'
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, storagePath)
	},
	filename: (req, file, cb) => {
		const time = moment().format('YYYY-MM-DD-HH-mm-ss')
		cb(null, time + '.webm')
	}
})
const upload = multer({ storage: storage })

app
	.use(express.static('public'))
	.use(express.static(storagePath))
	.get('/', (req, res, next) => {
		res.send('Hello')
	})
	.get('/delete', (req, res, next) => {
		fs.readdir(storagePath, (err, files) => {
			if (err) throw err
			files.forEach(file => {
				fs.unlinkSync(`${storagePath}/${file}`)
			})
			return res.send('ok')
		})
	})
	.post('/upload', upload.single('video'), (req, res, next) => {
		res.send('Success')
	})
	.get('/list', (req, res, next) => {
		fs.readdir(storagePath, (err, files) => {
			if (err) throw err
			res.json(files.map(filename => {
				return {
					filename: filename,
					date: getDate(filename)
				}
			}))
		})
	})
// .listen(3000, () => {
// 	console.log('URL -> localhost:3000')
// })'

https.createServer(options, app).listen(3000, () => {
	console.log('URL -> localhost:3000')
})