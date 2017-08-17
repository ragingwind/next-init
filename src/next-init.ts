#!/usr/bin/env node

import path = require('path')
import meow = require('meow')
import findCacheDir = require('find-cache-dir')
import Listr = require('listr')
import chalk = require('chalk')
import figures = require('figures')
import env from './env'
import parseArgs from './parse-args'
import prepare from './prepare'
import prompt from './prompt'
import create from './create'

const cli = meow(`
	Usage
		$ next-init <template> <dest>

	Examples
		# default template
		$ next-init
		$ next-init ./my-next-app

		# community boilerplates
		$ next-init username/repo
		$ next-init username/repo ./my-next-app

		# official examples to current or target path
		$ next-init next.js/examples/
		$ next-init next.js/examples/ ./my-next-app
		$ next-init next.js/examples/with-glamorous ./my-next-app
`)

async function main() {
	const cacheRoot = findCacheDir({
		name: 'next-init',
		create: true,
		cwd: __dirname
	})

	const tasks = new Listr([{
		title: 'Preparing...',
		task: ctx => parseArgs(cli.input).then(args => ctx.args = args)
	}, {
		title: 'Checking the cache',
		task: (ctx, task) => {
			task.title = `Checking the updates of ${ctx.args.template.replace(/\/$/, '')}`
			return prepare({
				template: ctx.args.template,
				cacheRoot: cacheRoot,
				force: cli.flags.force
			}).then(cacheInfo => {
				ctx.cacheInfo = cacheInfo

				task.title = `${cacheInfo.update ? 'Updates has been completed' : 'Latest updates'} for ${ctx.args.template.replace(/\/$/, '')}`
			})
		}
	}])

	tasks.run().then(ctx => {
		return env().then(env => {
			ctx.args = {...ctx.args, ...env}

			console.log('')
			return prompt(env, {
				projectName: path.basename(ctx.args.target),
				templates: ctx.cacheInfo.templates,
				target: ctx.args.target
			}).then(answers => {
				if (answers.overwrite === false) {
					return
				}

				// update template path with answered tempate name in the cached list
				if (answers.templateName) {
					ctx.cacheInfo.templatePath = path.join(ctx.cacheInfo.templatePath, answers.templateName)
				}

				console.log(chalk`\n {green ${figures.tick} }Create a new Next.js app in {green ${ctx.args.target} }`)

				// ctx.answers = answers
				return create({
					args: {...ctx.args, ...answers},
					cacheInfo: ctx.cacheInfo
				})
			})
		})
	}).catch(err => {
		console.error(chalk`\n {red ${figures.cross} }${err.stack}`)
		process.exit(-1)
	})
}

main()

