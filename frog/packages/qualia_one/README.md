# Profile

This package allows you to restrict Meteor to only build a single client bundle (either the legacy or the modern bundle). This is not recommended for use in production, but in development it can greatly improve reload speeds.

## Installation

This package must be installed locally, in the source tree of your application. Navigate to the root of your application and run the following command:

```sh
mkdir -p packages/ && cd packages/ && git clone https://github.com/qualialabs/one && mv one qualia_one && cd .. && meteor add qualia:one
```

It is unfortunate that this package cannot simply be installed from Atmosphere, but the build system treats locally installed packages differently from remote ones.

## Usage

You can specify which bundle you would like to build by setting the environment variable `QUALIA_ONE_BUNDLE_TYPE` to either `legacy` or `modern`. So you might run your application like:

```sh
$ QUALIA_ONE_BUNDLE_TYPE=modern meteor
```

The `legacy` option will work out of the box, but if you want to use the `modern` option you must modify your `.meteor/packages` file (located in the root directory of your project) so that `qualia:one` is at the very top of the file.

If `QUALIA_ONE_BUNDLE_TYPE` isn't set, this package won't do anything.
