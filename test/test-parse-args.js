import test from 'ava'
import parseArgs from '../dist/parse-args'
import * as path from 'path'

test(async t => {
	const args = await parseArgs([])

	t.true(args.template === 'next-init/templates/stable')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['./my-next-app'])

	t.true(args.template === 'next-init/templates/stable')
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
	const args = await parseArgs(['@latest'])

	t.true(args.template === 'next-init/templates/latest')
	t.true(args.target === path.resolve('./'))
})

test(async t => {
	const args = await parseArgs(['@latest', './my-next-app'])

	t.true(args.template === 'next-init/templates/latest')
	t.true(args.target === path.resolve('./my-next-app'))
})
