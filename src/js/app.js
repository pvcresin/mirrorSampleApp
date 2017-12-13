import 'webrtc-adapter'

console.log('hello')

let previousTouchX = -1
const contentArea = document.querySelector('.content')
const touchArea = document.querySelector('.touch')

touchArea.addEventListener('touchstart', e => {
	previousTouchX = -1
	touchArea.classList.add('pressed')
})
touchArea.addEventListener('touchmove', e => {
	const currentX = e.touches[0].clientX
	const dx = currentX - previousTouchX
	if (previousTouchX !== -1) {
		contentArea.scrollLeft -= dx
	}
	previousTouchX = currentX
})
touchArea.addEventListener('touchend', e => {
	touchArea.classList.remove('pressed')
})

const video = document.querySelector('video')
navigator.getUserMedia(
	{
		video: true,
		audio: false
	},
	stream => {
		video.src = window.URL.createObjectURL(stream)
	},
	err => {
		console.log(err)
	}
)