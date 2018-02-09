App
	.viewArea
		video.mirrorVideo(autoplay='1')
		video.playingVideo(
			if='{this.currentPage === this.PAGE.MIRROR}'
			ref='playingVideo'
			src='{getSelectedVideoSrc()}')
	.controlArea
		.toolbar(if='{this.currentPage === this.PAGE.TOP}')
			.open(click='{open}')
				.iconBox
					i.fa.fa-folder(aria-hidden='true')
			.rec(click='{startRecording}')
				.iconBox
					div
			.full(click='{fullscreen}')
				.iconBox
					i.fa.fa-expand(if='{!this.isFullscreen}' aria-hidden='true')
					i.fa.fa-compress(if='{this.isFullscreen}' aria-hidden='true')
		.toolbar(if='{this.currentPage === this.PAGE.REC}')
			div
			.stop(click='{stopRecording}')
				.iconBox
					i.fa.fa-stop(aria-hidden='true')
			div
		.toolbar(if='{this.currentPage === this.PAGE.CONFIRM}')
			.save(click='{save}')
				.iconBox
					i.fa.fa-floppy-o(aria-hidden='true')
			.discard(click='{discard}')
				.iconBox
					i.fa.fa-trash(aria-hidden='true')
		.toolbar(if='{this.currentPage === this.PAGE.SELECT}')
			.close(click='{close}')
				.iconBox
					i.fa.fa-folder-open(aria-hidden='true')
			.left(if='{existPrev()}' ref='left' click='{left}')
				.iconBox
					i.fa.fa-chevron-circle-left(aria-hidden='true')
			.left(if='{!existPrev()}' disabled)
				.iconBox
					i.fa.fa-chevron-circle-left(aria-hidden='true')
			.selectView(if='{list.length === 0}')
				.videoContainer
					.message No Video...
			.selectView(if='{list.length > 0}' click='{mirror}' ref='selectView')
				.videoContainer
					video(src='{getSelectedVideoSrc()}')
					.info
						p {this.getDate()}
			.right(if='{existNext()}' ref='right' click='{right}')
				.iconBox
					i.fa.fa-chevron-circle-right(aria-hidden='true')
			.right(if='{!existNext()}' disabled)
				.iconBox
					i.fa.fa-chevron-circle-right(aria-hidden='true')
		.toolbar(if='{this.currentPage === this.PAGE.MIRROR}')
			.back(click='{back}')
				.iconBox
					i.fa.fa-arrow-left(aria-hidden='true')
			.overlaySlider
				.mirrorIcon
					.mirror
				.sliderBox(ref='sliderBox'
					touchstart='{changeProgress}'
					touchmove='{changeProgress}'
					touchend='{changeProgress}')
					.slider
						.bar
							.progress(ref='progress')
				.videoIcon
					i.fa.fa-film(aria-hidden='true')
			.play(if='{!this.isPlaying}' click='{play}')
				.iconBox
					i.fa.fa-play(aria-hidden='true')
			.pause(if='{this.isPlaying}' click='{pause}')
				.iconBox
					i.fa.fa-pause(aria-hidden='true')

	script.
		import 'webrtc-adapter'
		import 'hammerjs'
		import screenfull from 'screenfull'

		this.PAGE = {
			TOP: 0,
			REC: 1,
			CONFIRM: 2,
			SELECT: 3,
			MIRROR: 4
		}
		this.DIRECTION = {
			PREV: 0,
			NEXT: 1
		}
		this.currentPage = this.PAGE.TOP
		this.recorder
		this.video
		this.selected
		this.isFullscreen = false
		this.isSwipeListener = false
		this.list = []
		this.currentListIndex = -1
		this.isPlaying = false

		this.on('mount', () => {
			console.log('mounted', opts)

			const video = document.querySelector('.mirrorVideo')
			navigator.getUserMedia(
				{ video: true, audio: false },
				stream => {
					video.srcObject = stream
					this.recorder = new MediaRecorder(stream)
					this.recorder.ondataavailable = e => {
						this.video = new File([e.data], 'mirror.webm',{ type: e.data.type })
					}
				},
				err => {
					alert(err)
					console.log(err)
				}
			)
		})
		this.on('updated', () => {
			if (this.currentPage === this.PAGE.SELECT) {
				if (!this.isSwipeListener) {
					const hammer = new Hammer(this.refs.selectView)
					hammer.on('swipe', e => {
						if (e.deltaX > 0) {	// ->
							this.updateVideoSelector(this.DIRECTION.PREV)
						} else {			// <-
							this.updateVideoSelector(this.DIRECTION.NEXT)
						}
						this.update()
					})
					this.isSwipeListener = true
				}
			} else {
				if (this.isSwipeListener) {
					this.isSwipeListener = false
				}
			}
		})

		fullscreen(e) {
			console.log('fullscreen')
			screenfull.toggle()
			this.isFullscreen = !screenfull.isFullscreen
		}
		startRecording(e) {
			this.recorder.start()
			this.currentPage = this.PAGE.REC
		}
		stopRecording(e) {
			this.recorder.stop()
			this.currentPage = this.PAGE.CONFIRM
		}
		upload(file) {
			const url = '/upload'
			const sendData = new FormData()
			sendData.append('video', file)
			return fetch(url, {
				method: 'POST',
				body: sendData
			}).then(response => {
				return response.text()
			})
		}
		save(e) {
			this.upload(this.video).then(res => {
				console.log(res)
			})
			this.currentPage = this.PAGE.TOP
		}
		discard(e) {
			this.currentPage = this.PAGE.TOP
		}
		getVideos() {
			const url = '/list'
			return fetch(url).then(response => {
				return response.json()
			})
		}
		getDate() {
			const d = this.list[this.currentListIndex].date
			return `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`
		}
		getSelectedVideoSrc() {
			return `${this.list[this.currentListIndex].filename}`
		}
		open(e) {
			this.getVideos().then(videos => {
				console.log(videos)
				this.currentPage = this.PAGE.SELECT
				if (videos.length === 0) {
					this.list = []
					this.currentListIndex = -1
				} else {
					this.list = videos.reverse()
					this.currentListIndex = 0
				}
				this.update()
			})
		}
		close(e) {
			this.currentPage = this.PAGE.TOP
		}
		left(e) {
			this.updateVideoSelector(this.DIRECTION.PREV)
		}
		right(e) {
			this.updateVideoSelector(this.DIRECTION.NEXT)
		}
		updateVideoSelector(direction) {
			if (direction === this.DIRECTION.PREV && this.existPrev()) {
				this.currentListIndex--
			} else if (direction === this.DIRECTION.NEXT && this.existNext()) {
				this.currentListIndex++
			} else {
			}
		}
		existPrev() {
			if (this.list.length <= 1) return false
			if (this.currentListIndex === 0) return false
			else return true
		}
		existNext() {
			if (this.list.length <= 1) return false
			if (this.currentListIndex === this.list.length - 1) return false
			else return true
		}
		mirror(e) {
			this.currentPage = this.PAGE.MIRROR
		}
		back(e) {
			console.log('back')
			this.currentPage = this.PAGE.SELECT
		}
		changeProgress(e) {
			const rect = this.refs.sliderBox.getBoundingClientRect()
			const dx = e.touches[0].clientX - rect.left
			let ratio = dx / rect.width
			if (ratio < 0) ratio = 0
			else if (ratio > 1) ratio = 1
			this.refs.progress.style.width = (ratio * 100) + '%'
			this.refs.playingVideo.style.opacity = ratio
		}
		play(e) {
			const video = this.refs.playingVideo
			video.play()
			this.isPlaying = true
			video.onended = () => {
				video.pause()
				this.update({ isPlaying: false })
			}
		}
		pause(e) {
			this.refs.playingVideo.pause()
			this.isPlaying = false
		}