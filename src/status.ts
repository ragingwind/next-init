import ora = require('ora')
import u from './utils'

export class Status {
	spinner: any

	constructor() {
		this.spinner = null
	}

	text(msg:string) {
		if (!this.spinner) {
			this.spinner = ora(msg).start()
		} else {
			this.spinner.text = msg
		}
	}

	hide(msg:string) {
		if (!this.spinner) {
			return
		}

		this.spinner.stopAndPersist({
			symbol: u.whiteText('▲'),
			text: msg
		})
	}
}

let s = new Status()

export default s
