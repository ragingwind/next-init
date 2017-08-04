#!/usr/bin/env node

import meow = require('meow')
import env from './env'
import parseArgs from './parse-args'
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
const target = cli.input[1]

async function main() {
	const args = await parseArgs(cli)
	const answers = await prompt(await env())

	console.log(answers)
}

main()

