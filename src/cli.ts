#!/usr/bin/env node

import meow = require('meow')
import env from './env'
import parseArgs from './parse-args'
import prepare from './prepare'
import prompt from './prompt'
import create from './create'

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

async function main() {
	try {
		const args = await parseArgs(cli.input)
		const cacheInfo = await prepare(args)
		const answers = await prompt(await env(), {...args, ...cacheInfo})
		create({...args, ...cacheInfo, ...answers})
	} catch (err) {
		console.error(err.toString())
	}
}

main()

