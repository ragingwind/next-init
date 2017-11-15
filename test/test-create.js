import * as path from 'path'
import test from 'ava'
import fs from 'fs-extra'
import findCacheDir from 'find-cache-dir'
import create from '../dist/create'
import env from '../dist/env'

test.before(async t => {
	await fs.remove(path.resolve('./node_modules/.cache/test-next-init-create'))

	findCacheDir({
		name: 'test-next-init-create',
		create: true
	})
})

test(async t => {
	const args = {
		target: './node_modules/.cache/test-next-init-create/basic'
	}

	const cacheInfo = {
		templatePath: path.resolve('./template/default')
	}

	const opts = {
		args: Object.assign(args, await env()),
		cacheInfo: cacheInfo
	}

	const output = path.resolve(args.target)

	await create(opts)

	const stat = await fs.stat(output)
	t.true(stat.isDirectory())

	const pkg = await fs.readFile(path.join(output, 'package.json'))
	t.true(pkg.toString().indexOf(args.user.name) > 0)
})

test('missing hit', async t => {
	const args = {
		target: './node_modules/.cache/test-next-init-create/basic-wrong'
	}

	const cacheInfo = {
		templatePath: './template-wrong'
	}

	const opts = {
		args: Object.assign(args, await env()),
		cacheInfo
	}

	try {
		await create(opts)
	} catch (err) {
		t.pass()
	}
})
