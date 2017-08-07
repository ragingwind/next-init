import inquirer = require('inquirer')

interface PropmptProps {
  [key: string]: any
}

export default function (env: any, args: any) {
	const prompts: PropmptProps = [{
		name: 'projectName',
		message: 'Project name?',
		default: args.baseTarget || env.projectName
	}, {
		name: 'description',
		message: 'Module description?',
		default: env.description
	}, {
		name: 'username',
		message: 'Username? (eg, Github)',
		default: env.user.name
	}]

	if (args.templateName === '' && args.templates.length > 0) {
		inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

		prompts.unshift({
			type: 'autocomplete',
			name: 'template',
			message: 'Templates name?',
			choices: args.templates,
			source: (answers, input) => {
				return new Promise(function(resolve) {
					resolve(input ?
						args.templates.filter(t => t.indexOf(input) > -1) :
						args.templates)
				})
			},
			filter: function (val) {
				return val.toLowerCase();
			}
		})
	}

	return inquirer.prompt(prompts)
}
