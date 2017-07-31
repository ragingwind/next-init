#!/usr/bin/env node

import meow = require('meow')
import env from './env'
import prompt from './prompt'

const cli = meow(`
	Usage

	Options

	Examples
		$ next-init
`, {
	alias: {
		'e': 'example'
	}
})

const template = cli.input[0]

// check that is official template
env().then(prompt).then(answers => {
	console.log(answers)
})

