import inquirer = require('inquirer')

export default function (env: any) {
	return inquirer.prompt([{
		name: 'projectName',
		message: 'Project name?',
		default: env.projectName
	}, {
		name: 'description',
		message: 'Module description?',
		default: env.description
	}, {
		name: 'username',
		message: 'Username? (eg, Github)',
		default: env.user.name
	}])
}
