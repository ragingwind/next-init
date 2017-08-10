#!/usr/bin/env node

import path = require('path')
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
		const cacheRoot = findCacheDir({
			name: 'next-init',
			create: true,
			cwd: __dirname
		})

		const args = await parseArgs(cli.input)

		const cacheInfo = await prepare({
			template: args.template,
			cacheRoot: cacheRoot,
			force: cli.flags.force,
		})

		const answers = await prompt(await env(), {
			projectName: path.basename(args.target),
			templates: cacheInfo.templates
		})

		await create({...args, ...cacheInfo, ...answers})
	} catch (err) {
		console.error(`\nYou've got error: ${err.toString()}`)
		process.exit(-1)
	}
}

main()

