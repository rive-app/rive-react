# Contributing

We love contributions! If you want to run the project locally to test out changes, run the examples, or just see how things work under the hood, read on below.

## Local development

This runtime consumes specific tied-down versions of the [JS/WASM runtime](https://github.com/rive-app/rive-wasm) to have better control over changes that occur in that downstream runtime.

### Installation

1. Clone the project down
2. Run `npm i` in the shell/terminal at the base of the project to install the dependencies needed for the project

### Local dev server

To start the local dev server to reflect any changes made to the core `src/` files, run the following in a terminal tab:

```
npm run dev
```

### Running the example storybook locally

We use Storybook to deploy our examples out onto a public-facing page for folks to view and see code examples for. It also serves as the place we'll include any example suites. These story files are stored in `examples/**.stories.mdx`. `.mdx` is an extension Storybook supports to support both `jsx` (React files) and `md` (markdown) in one file.

To run Storybook, run the following command in the terminal:

```
npm run storybook
```

Any changes made in any files should reflect automatically, including the `.mdx` example files, and `src/` files.

### Testing

We also have a suite of unit tests against the high-level component and various hooks exported in the `test/` folder. When adding new components, changing the API, or underlying functionality, make sure to add a test here!

To run the test suite:

```
npm test
```

## Making changes

When you're ready to make changes, push up to a feature branch off of the `main` branch. Create a pull request to this repository in Github. When creating commit messages, please be as descriptive as possible to the changes being made.

For example, if the change is simply a bug fix or patch change:

```
git commit -m "Fix: Fixing a return type from useRive"
```

Or if it's simply a docs change:

```
git commit -m "Docs: Adding a new link for another example page"
```

For minor/major version releases, also ensure you preface commit messages with:

```
git commit -m "Major: Restructuring the useRive API with new parameters"
```

These messages help make the changelog clear as to what changes are made for future devs to see.

When pull requests are merged, the runtime will automatically deploy the next release version. By default, patch versions are published. If you want to set the next version as a minor/major version to be released, you have to manually update the `package.json` file at the root of the project to the verison you want it to.

You can find the deploy scripts in `.github/`

## Bumping the underlying JS/WASM runtime

Many times, fixes to the runtime and feature adds come from the underlying JS/WASM runtime. In these cases, just bump the `@rive-app/canvas` and `@rive-app/webgl` versions to the verison you need to incorporate the fix/feature. Run `npm i` and test out the change locally against the Storybook examples and run the test suite to make sure nothing breaks, and then submit a PR with just the `package.json` change if that's all that's needed.
