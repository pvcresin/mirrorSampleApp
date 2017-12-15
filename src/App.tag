App
	.viewArea
		video(autoplay='1')
	.controlArea
		.toolbar(if='{this.currentPage == this.PAGE.TOP}')
			.file
				.iconBox
					i.fa.fa-folder(aria-hidden='true')
			.rec(click='{startRecording}')
				.iconBox
					div
			.full
				.iconBox
					i.fa.fa-arrows-alt(aria-hidden='true')
		.toolbar(if='{this.currentPage == this.PAGE.REC}')
			div
			.stop(click='{stopRecording}')
				.iconBox
					i.fa.fa-stop(aria-hidden='true')
			div
		.toolbar(if='{this.currentPage == this.PAGE.CONFIRM}')
			.save(click='{save}')
				.iconBox
					i.fa.fa-floppy-o(aria-hidden='true')
			.discard(click='{discard}')
				.iconBox
					i.fa.fa-trash(aria-hidden='true')

	script.
		this.PAGE = {
			TOP: 0,
			REC: 1,
			CONFIRM: 2,
			SELECT: 3,
			PLAY: 4
		}
		this.currentPage = this.PAGE.TOP

		this.on('mount', () => {
			console.log('mounted', opts)

			const video = document.querySelector('video')
			navigator.getUserMedia(
				{ video: true, audio: false },
				stream => {
					video.srcObject = stream
				},
				err => {
					console.log(err)
				}
			)
		})
		startRecording(e) {
			console.log('rec')
			this.update({ currentPage: this.PAGE.REC })
		}
		stopRecording(e) {
			console.log('stop')
			this.update({ currentPage: this.PAGE.CONFIRM })
		}
		save(e) {
			console.log('save')
			this.update({ currentPage: this.PAGE.TOP })
		}
		discard(e) {
			console.log('discard')
			this.update({ currentPage: this.PAGE.TOP })
		}