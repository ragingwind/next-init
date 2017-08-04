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

test(async t => {
	await prepare('test-next-init', {
		template: 'basic'
	})

	t.true(await fs.exists(`${cacheRoot}/nextjs-templates/basic/package.json`))

	const cacheInfo = await prepare('test-next-init', {
		template: 'basic'
	})

	t.true(await fs.exists(`${cacheRoot}/nextjs-templates/basic/package.json`))
	t.true(cacheInfo.templates.indexOf('basic') > -1)
})

test(async t => {
	let cacheInfo = await prepare('test-next-init', {
		template: 'next.js/examples'
	})

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js/examples`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/next.js/package.json`))

	cacheInfo = await prepare('test-next-init', {
		template: 'next.js/examples/with-glamorous'
	})

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js/examples/with-glamorous`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/next.js/examples/with-glamorous/package.json`))
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
})

test.serial(async t => {
	const cacheInfo = await prepare('test-next-init', {
		template: 'ragingwind/nextjs-hnpwa'
	})

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/ragingwind/nextjs-hnpwa`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/ragingwind/nextjs-hnpwa/package.json`))
})
