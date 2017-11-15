import path = require('path')
import fs = require('fs-extra')
import inquirer = require('inquirer')
import u from './utils'

interface PropmptProps {
  [key: string]: any
}

export default function ({
	args,
	templates,
	interactive
}) {
	const projectName = path.basename(args.target)
	let prompts = []

	if (!u.isExamplesPath(args.template) && interactive) {
		prompts = [{
			name: 'projectName',
			message: 'Project name?',
			default: path.basename(args.target)
		}, {
			name: 'description',
			message: 'Module description?',
			default: args.description
		}, {
			name: 'username',
			message: 'Username? (eg, Github)',
			default: args.user.name
		}]
	}

	if ((u.isSamePath(args.target) && fs.readdirSync(args.target).length > 0) ||
		(!u.isSamePath(args.target) && fs.pathExistsSync(args.target))) {
		prompts.push({
			type: 'confirm',
			name: 'overwrite',
			message: 'Target is exist already, overwrite?',
			default: true
		})
	}

	if (templates && templates.length > 0) {
		inquirer.registerPrompt('autocomplete',
			require('inquirer-autocomplete-prompt'))

		prompts.unshift({
			type: 'autocomplete',
			name: 'templateName',
			message: 'Templates name?',
			choices: templates,
			source: (answers, input) => {
				return new Promise(function(resolve) {
					resolve(input ?
						templates.filter(t => t.indexOf(input) > -1) :
						templates)
				})
			},
			filter: function (val) {
				return val.toLowerCase();
			}
		})
	}

	return inquirer.prompt(prompts)
}
