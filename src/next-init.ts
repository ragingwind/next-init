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
				const updates = cacheInfo.update ? 'Updates has been completed' : 'No updates'
				const template = ctx.args.template.replace(/\/$/, '')
				task.title = `${updates} for ${template}`
			})
		}
	}])

	tasks.run().then(ctx => {
		return env().then(env => {
			ctx.env = env
			console.log('')
			return prompt(env, {
				projectName: path.basename(ctx.args.target),
				templates: ctx.cacheInfo.templates,
				target: ctx.args.target
			}).then(answers => {
				if (answers.overwrite === false) {
					return
				}

				console.log(chalk`\n {green ${figures.tick} }Create a new Next.js app in {green ${ctx.args.target} }`)

				ctx.answers = answers
				return create({
					args: {
						...ctx.args,
						...ctx.env,
						...ctx.answers
					},
					target: ctx.args.target,
					...ctx.cacheInfo
				})
			})
		})
	}).catch(err => {
		console.error(chalk`\n {red ${figures.cross} }${err.stack}`)
		process.exit(-1)
	})
}

main()

