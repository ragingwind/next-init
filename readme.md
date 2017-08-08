![](https://avatars2.githubusercontent.com/u/30463846?v=4&u=b080ecd2d7d1226eb6e982cf1de875d4765e275d&s=200)

# next-init [![Build Status](https://travis-ci.org/next-init/next-init.svg?branch=master)](https://travis-ci.org/next-init/next-init)

> ✒ CLI for Next.js apps scaffolding from whatever

## Install

```
$ npm install -g next-init
```

## Examples

```sh
# from a list of official template to current or target path
$ next-init
$ next-init ./my-next-app

# from an official template, `basic`, to current or target path
# same as `next init`
$ next-init basic
$ next-init basic ./my-next-app

# from a boilerplate or a custom template to current or target path
# inspired from `vue init`
$ next-init someone/someone-next-app
$ next-init someone/someone-next-app ./my-next-app

# from a list of official examples to current or target path
$ next-init next.js/examples/
$ next-init next.js/examples/ ./my-next-app

# from an official named example, `with-glamorous`, to current or target path
$ next-init next.js/examples/with-glamorous
$ next-init next.js/examples/with-glamorous ./my-next-app

# get a list of official `templates`
$ next-init --list

# get a list of official `examples`
$ next-init next.js/examples --list

# show help
$ next-init --help
```

## License

MIT © [next-init](https://github.com/next-init)
