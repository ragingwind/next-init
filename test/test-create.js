import * as path from 'path'
import test from 'ava'
import fs from 'mz/fs'
import rimraf from 'rimraf'
import findCacheDir from 'find-cache-dir'
import create from '../dist/create'
import env from '../dist/env'

const cachePath = './features'
const template = 'basic'
const target = './node_modules/.cache/test-next-init-create/basic'

test.before(t => {
	rimraf.sync(path.resolve('./node_modules/.cache/test-next-init-create'))

	findCacheDir({
		name: 'test-next-init-create',
		create: true
	})
})

test(async t => {
	const e = await env()
	const args = {
		cachePath,
		template,
		target,
	}
	const output = path.resolve(target)

	await create(Object.assign({}, args, e))

	const res = await fs.stat(output)
	t.true(res.isDirectory())

	const pkg = await fs.readFile(path.join(output, 'package.json'))
	t.true(pkg.toString().indexOf(e.user.name) > 0)
})
