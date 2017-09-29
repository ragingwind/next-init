#!/usr/bin/env node

import path = require('path')
import mri = require('mri')
import findCacheDir = require('find-cache-dir')
import Listr = require('listr')
import chalk = require('chalk')
import figures = require('figures')
import env from './env'
import parseArgs from './parse-args'
import prepare from './prepare'
import prompt from './prompt'
import create from './create'
import u from './utils'

const args = process.argv.slice(2);
const help = `
Usage
  $ next-init <template> <dest> <options>

Examples
  # default template
  $ next-init
  $ next-init ./my-next-app

  #default template with @beta
  $ next-init @beta
  $ next-init @beta ./my-next-app

  # community boilerplates
  $ next-init username/repo
  $ next-init username/repo ./my-next-app

  # official examples to current or target path
  $ next-init next.js/examples/
  $ next-init next.js/examples/ ./my-next-app
  $ next-init next.js/examples/with-glamorous ./my-next-app

Options
  force    force update target template`

async function main() {
	const cli = mri(process.argv.slice(2))

	if (cli.help) {
		console.log(help)
		return
	}

	const cacheRoot = findCacheDir({
		name: 'next-init',
		create: true,
		cwd: __dirname
	})

	const tasks = new Listr([{
		title: 'Preparing...',
		task: async ctx => ctx.args = await parseArgs(cli._)
	}, {
		title: 'Checking the template project',
		task: async (ctx, task) => {
			if (!u.isDefaults(ctx.args.template)) {
				task.title = `Checking the updates of ${ctx.args.template.replace(/\/$/, '')}`
			}

			ctx.cacheInfo = await prepare({
				template: ctx.args.template,
				cacheRoot: cacheRoot,
				force: cli.force
			})

			if (!u.isDefaults(ctx.args.template)) {
				task.title = `${ctx.cacheInfo.update ? 'Updates has been completed' : 'Latest updates'} for ${ctx.args.template.replace(/\/$/, '')}`
			}
		}
	}])

	const envInfo = await env()
	const ctx = await tasks.run()
	let answers

	// ctx.args = {...ctx.args, ...envInfo}
	// add empty line
	console.log('')

	answers = await prompt({
		args: {...ctx.args, ...envInfo},
		templates: ctx.cacheInfo.templates
	})

	if (answers.overwrite === false) {
		return
	}

	// update template path with answered tempate name in the cached list
	if (answers.templateName) {
		ctx.cacheInfo.templatePath = path.join(ctx.cacheInfo.templatePath, answers.templateName)
	}

	try {
		// ctx.answers = answers
		console.log(chalk`\n {green ${figures.tick} }Create a new Next.js app in {green ${ctx.args.target} }`)

		await create({
			args: {...ctx.args, ...envInfo, ...answers},
			cacheInfo: ctx.cacheInfo
		})
	} catch (err) {
		console.error(chalk`\n {red ${figures.cross} }${err.stack}`)
		process.exit(-1)
	}
}

main()

