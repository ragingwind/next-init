#!/usr/bin/env node

import path = require('path')
import mri = require('mri')
import findCacheDir = require('find-cache-dir')
import figures = require('figures')
import env from './env'
import parseArgs from './parse-args'
import prepare from './prepare'
import prompt from './prompt'
import create from './create'
import status from './status'
import install from './install'
import u from './utils'

const args = process.argv.slice(2);
const help = `
Usage
  $ next-init <template> <dest> <options>

Examples
  # default template
  $ next-init
  $ next-init ./my-next-app

  # default template with @latest
  $ next-init @latest
  $ next-init @latest ./my-next-app

  # community boilerplates on github
  $ next-init username/repo
  $ next-init username/repo ./my-next-app

  # official examples to current or target path
  $ next-init next.js/examples/
  $ next-init next.js/examples/ ./my-next-app
  $ next-init next.js/examples/with-glamorous ./my-next-app

Options
	interactive    use interactive mode for params in template
	force          force update target template`

async function main() {
	const cli = mri(process.argv.slice(2), {
		alias: {
			i: 'interactive',
			f: 'force'
		},
		boolean: ['interactive', 'force'],
		default: {
			interactive: false,
			force: false
		}
	})

	if (cli.help) {
		console.log(help)
		return
	}

	const cacheRoot = findCacheDir({
		name: 'next-init',
		create: true,
		cwd: __dirname
	})

	try {
		const args = await parseArgs(cli._)

		if (!u.isDefaults(args.template)) {
			status.text(`Checking the updates of ${args.template.replace(/\/$/, '')}`)
		}

		const cacheInfo = await prepare({
			template: args.template,
			cacheRoot: cacheRoot,
			force: cli.force
		})

		if (!u.isDefaults(args.template)) {
			status.hide(`${cacheInfo.update ?
				'Updates has been completed' :
				'Latest updates'} for ${args.template.replace(/\/$/, '')}`)
		}

		const envInfo = await env()
		const answers = await prompt({
			args: {...args, ...envInfo},
			templates: cacheInfo.templates,
			interactive: cli.interactive
		})

		if (answers.overwrite === false) {
			return
		}

		// update template path with answered tempate name in the cached list
		if (answers.templateName) {
			cacheInfo.templatePath = path.join(cacheInfo.templatePath, answers.templateName)
		}

		await create({
			args: {...args, ...envInfo, ...answers},
			cacheInfo: cacheInfo
		})

		if (u.isLatestTemplatePath(args.template)) {
			await install(args)
		}
	} catch (err) {
		console.error(`\n ${u.redText(err.toString())}`)
		process.exit(-1)
	}
}

main()

