import * as path from 'path'
import test from 'ava'
import fs from 'mz/fs'
import rimraf from 'rimraf'
import findCacheDir from 'find-cache-dir'
import prepare from '../dist/prepare'

const cacheRoot = './node_modules/.cache/test-next-init'

test.before(t => {
	rimraf.sync(cacheRoot)
})

test.serial(async t => {
	await prepare('test-next-init', {
		template: 'basic'
	})

	t.true(await fs.exists(`${cacheRoot}/basic/package.json`))

	await prepare('test-next-init', {
		template: 'basic'
	})

	t.true(await fs.exists(`${cacheRoot}/basic/package.json`))
})

test.serial(async t => {
	let cachedPath = await prepare('test-next-init', {
		template: 'next.js/examples'
	})

	t.true(cachedPath.indexOf(path.resolve(`${cacheRoot}/next.js/examples`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/next.js/package.json`))

	cachedPath = await prepare('test-next-init', {
		template: 'next.js/examples/with-glamorous'
	})

	t.true(cachedPath.indexOf(path.resolve(`${cacheRoot}/next.js/examples/with-glamorous`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/next.js/examples/with-glamorous/package.json`))
})

test.serial(async t => {
	const cachedPath = await prepare('test-next-init', {
		template: 'ragingwind/nextjs-hnpwa'
	})

	t.true(cachedPath.indexOf(path.resolve(`${cacheRoot}/ragingwind/nextjs-hnpwa`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/ragingwind/nextjs-hnpwa/package.json`))
})
