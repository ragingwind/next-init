import ora = require('ora')
const ansiEscapes = require('ansi-escapes')

const spinner = ora()

function start(text = '', color = 'red') {
	spinner.text = text
	spinner.color = color
	spinner.start()
}

function stop(erase = true) {
	erase && process.stdout.write(ansiEscapes.eraseLines(1))
	spinner.stop()
}

function update(text = '', color = 'red') {
	spinner.text = text
	spinner.color = color
}

export default {
	start,
	stop,
	update
}
