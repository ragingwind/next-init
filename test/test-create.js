import * as path from 'path'
import test from 'ava'
import fs from 'fs-extra'
import findCacheDir from 'find-cache-dir'
import create from '../dist/create'
import env from '../dist/env'

const templatesPath = './features'
const templateName = 'basic'
const target = './node_modules/.cache/test-next-init-create/basic'

test.before(async t => {
	await fs.remove(path.resolve('./node_modules/.cache/test-next-init-create'))

	findCacheDir({
		name: 'test-next-init-create',
		create: true
	})
})

test(async t => {
	const e = await env()
	const opts = {
		args: e,
		templatesPath,
		templateName,
		target,
	}
	const output = path.resolve(target)

	await create(opts)

	const stat = await fs.stat(output)
	t.true(stat.isDirectory())

	const pkg = await fs.readFile(path.join(output, 'package.json'))
	t.true(pkg.toString().indexOf(e.user.name) > 0)
})

test('missing hit', async t => {
	const e = await env()
	const opts = {
		args: e,
		templatesPath: './features-wrong',
		templateName: '',
		target: './node_modules/.cache/test-next-init-create/basic-wrong'
	}
	const output = path.resolve(target)

	try {
		await create(opts)
	} catch (err) {

	}

	t.pass()
})
