import test from 'ava'
import parseArgs from '../dist/parse-args'
import * as path from 'path'

test(async t => {
	const args = await parseArgs([])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['./my-next-app'])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./my-next-app'))
})

test(async t => {
	const args = await parseArgs(['someone/someone-next-app'])

	t.true(args.template === 'someone/someone-next-app')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['someone/someone-next-app', './my-next-app'])

	t.true(args.template === 'someone/someone-next-app')
	t.true(args.target === path.resolve('./my-next-app'))
})

test(async t => {
	const args = await parseArgs(['next.js/examples/with-glamorous'])

	t.true(args.template === 'next.js/examples/with-glamorous')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['next.js/examples/with-glamorous', './my-next-app'])

	t.true(args.template === 'next.js/examples/with-glamorous')
	t.true(args.target === path.resolve('./my-next-app'))
})

test(async t => {
	const args = await parseArgs(['next.js/examples'])

	t.true(args.template === 'next.js/examples')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['next.js/examples', './my-next-app'])

	t.true(args.template === 'next.js/examples')
	t.true(args.target === path.resolve('./my-next-app'))
})

test(async t => {
	let args = await parseArgs(['@latest'])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./'))
	
	args = await parseArgs(['@canary'])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	let args = await parseArgs(['@latest', './my-next-app'])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./my-next-app'))
	
	args = await parseArgs(['@canary', './my-next-app'])

	t.true(args.template === 'next-init/templates/default')
	t.true(args.target === path.resolve('./my-next-app'))
})