#!/usr/bin/env node

import meow = require('meow')
import findCacheDir = require('find-cache-dir')
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
		const rootPath = findCacheDir({
			name: 'next-init',
			create: true,
			cwd: __dirname
		})

		const args = await parseArgs(cli.input)
		const cacheInfo = await prepare({...args, rootPath})
		const answers = await prompt(await env(), {...args, ...cacheInfo})
		await create({...args, ...cacheInfo, ...answers})
	} catch (err) {
		console.error(`\nYou've got error: ${err.toString()}`)
		process.exit(-1)
	}
}

main()

