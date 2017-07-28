# next-init [![Build Status](https://travis-ci.org/next-init/next-init.svg?branch=master)](https://travis-ci.org/next-init/next-init)

> ✒ CLI for Next.js apps scaffolding from whatever

## Install

```
$ npm install -g next-init
```

## Examples

```sh
# from a list of official tempalte to current or target path
$ next-init
$ next-init ./my-next-app

# from an official tempalte, `default`, to current or target path
# same as `next init`
$ next-init default
$ next-init default ./my-next-app

# from a boilerplate or a custom template to current or target path
# inspired from `vue init`
$ next-init /someone/someone-next-app
$ next-init /someone/someone-next-app ./my-next-app

# from an official named example, `with-glamorous`, to current or target path
$ next-init --example with-glamorous
$ next-init --example with-glamorous ./my-next-app
$ next-init /next.js/examples/with-glamorous
$ next-init /next.js/examples/with-glamorous ./my-next-app

# from a list of official examples to current or target path
$ next-init --example
$ next-init --example ./my-next-app
$ next-init /next.js/examples/
$ next-init /next.js/examples/ ./my-next-app

# get a list of official `tempaltes`
$ next-init --list

# get a list of official `examples`
$ next-init --example --list

# show help
$ next-init --help
```

## License

MIT © [next-init](https://github.com/next-init)
