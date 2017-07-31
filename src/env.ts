import path = require('path')
import execa = require('execa')
import superb = require('superb')
import username = require('username')
import githubUsername = require('github-username')

export async function userinfo() {
	const user = {
		name: '',
		sh: '',
		git: '',
		github: '',
		email: ''
	}

	// get user name from git and github
	if (!(await execa.shell('which git')).failed) {
		user.email = (await execa.shell('git config --get user.email')).stdout.trim()
		user.git = (await execa.shell('git config --get user.name')).stdout.trim()
		user.github = await githubUsername(user.email)
	}

	// get user name from shell
	user.sh = await username()

	// presending of github user name
	user.name = user.github || user.git || user.sh

	return user
}

export default function () {
	return new Promise(async resolve => {
		const env = {
			projectName: path.relative('../', process.cwd()),
			description: `My ${superb()} project with Next.js`,
			user: await userinfo()
		}

		resolve(env)
	})
}
