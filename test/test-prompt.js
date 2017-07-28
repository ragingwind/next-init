import test from 'ava'
import prompt from '../dist/prompt'
import inquirer from 'inquirer'

function autosubmit(ui) {
	return new Promise(resolve => {
		ui.process.subscribe(function () {
			setTimeout(function () {
				ui.rl.emit('line')
				resolve()
			}, 5);
		});
		ui.rl.emit('line')
	})
}

test(async t => {
	const promise = prompt()
	await autosubmit(promise.ui)
	const a = await Promise.resolve(promise)
	t.true(a !== undefined)
});
