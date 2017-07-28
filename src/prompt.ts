import inquirer = require('inquirer')

export default function (template: string) {
	return inquirer.prompt([{
		name: 'projectName',
		message: 'Project name?',
		default: ''
	}, {
		name: 'description',
		message: 'Module description?',
		default: ``
	}, {
		name: 'username',
		message: 'Username? (eg, Github)',
		default: `john doh`
	}])
}
