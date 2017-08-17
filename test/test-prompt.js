import test from 'ava'
import inquirer from 'inquirer'
import prompt from '../dist/prompt'

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
	const promise = prompt({
		args: {
			target: './test',
			projectName: 'test',
			description: 'description',
			user: {
				name: 'test'
			}
		}
	}, {})

	await autosubmit(promise.ui)
	t.true(await Promise.resolve(promise) !== undefined)
});
