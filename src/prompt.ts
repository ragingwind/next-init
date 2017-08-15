import fs = require('fs-extra')
import inquirer = require('inquirer')

interface PropmptProps {
  [key: string]: any
}

export default function (env: any, {
	projectName,
	templates,
	target
}) {
	const prompts: PropmptProps = [{
		name: 'projectName',
		message: 'Project name?',
		default: projectName || env.projectName
	}, {
		name: 'description',
		message: 'Module description?',
		default: env.description
	}, {
		name: 'username',
		message: 'Username? (eg, Github)',
		default: env.user.name
	}]

	if (fs.pathExistsSync(target)) {
		prompts.push({
			type: 'confirm',
			name: 'overwrite',
			message: 'Target path is exist already, overwrite?',
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
