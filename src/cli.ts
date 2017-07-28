#!/usr/bin/env node

import meow from 'meow'
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
prompt(template).then(answers => {
	console.log(answers)
})

