# Serverless Env Obj

This Serverless plugin allows you to use a simple object structure for your `environment` settings.

It encodes your config into a flattened format for parsing at runtime.

## Installing

Install the plugin using NPM:

`npm install --save-dev serverless-env-obj`

Then include it in your plugins list in `serverless.yml`:

```yml
plugins:
  - serverless-webpack
  - serverless-env-obj
  - serverless-s3-local
  - serverless-offline
```

Then specify your global / per-function `environment` settings in object format:

```yml
environment:
  foo:
    bar:
      qux: grault
      kirYix: melb
```

This will be encoded into:

```yml
environment:
  FOO__BAR__QUX: grault
  FOO__BAR__KIR_YIX: melb
```

## Why?

- Specifying environment settings in object format allows settings to be grouped into a semantic hierarchy.
- These environment variables can be decoded at run time but lambda functions back into a structured object (eg: using [fp-env](https://github.com/garymcleanhall/fp-env))

## Debugging

You can use `npx sls print` to check the output environment settings after processing by this plugin.
