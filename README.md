# Components

This is a [lerna](https://lerna.js.org/) monorepo containing a suite of UI components built, used and maintained by [Storm Id](https://stormid.com).

Each package is available for use on npm. See [the docs](https://github.com/stormid/components/blob/master/README.md) for details on each package.

---

# Packages

| Package                                   | Description                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Boilerplate](./packages/boilerplate)     | Boilerplate for developing new components                                                                                                           |
| [Cookie Banner](./packages/cookie-banner) | GDPR compliant cookie banner                                                                                                                        |
| [Modal](./packages/modal)                 | Accessible modal dialog                                                                                                                             |
| [Modal Gallery](./packages/modal-gallery) | Accessible modal gallery                                                                                                                            |
| [Outliner](./packages/outliner)           | Hide CSS outline on mouse interactions, until [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) has broader support |
| [Scroll Points](./packages/scroll-points) | Trigger events based on element intersecting the viewport                                                                                           |
| [Scroll Spy](./packages/scroll-spy)       | Update elements based on target element intersecting the viewport                                                                                   |
| [Skip](./packages/skip)                   | Ensure fragment identifier links focus on their target node                                                                                         |
| [Tabs](./packages/tabs)                   | Accessible tabbed panelled content areas                                                                                                            |
| [Textarea](./packages/textarea)           | Auto-resizing textarea                                                                                                                              |
| [Toggle](./packages/toggle)               | Accessible DOM element expand and collapse                                                                                                          |
| [Validate](./packages/validate)           | Client-side form validation library                                                                                                                 |

# Commands

Install [lerna](https://www.npmjs.com/package/lerna) to use the Lerna CLI.

Package tasks

| Task                                | Command                              |
| ----------------------------------- | ------------------------------------ |
| Run the example app                 | lerna run dev --scope=PACKAGE_NAME   |
| Output the example app in prod mode | lerna run prod --scope=PACKAGE_NAME  |
| Run tests                           | lerna run test --scope=PACKAGE_NAME  |
| Build the package for distribution  | lerna run build --scope=PACKAGE_NAME |

Monorepo tasks

| Task                                                                                | Command                                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Lint all packages                                                                   | npm run lint -- --fix                                                      |
| [Lerna changed](https://github.com/lerna/lerna/tree/master/commands/changed#readme) | List of packages that would be the subjects of the next version or publish |
| [Lerna version](https://github.com/lerna/lerna/tree/master/commands/version#readme) | Bump version of packages changed since the last release                    |
| [Lerna publish](https://github.com/lerna/lerna/tree/master/commands/publish#readme) | Publish packages in the current project                                    |

The full list of Lerna commands is listed in the [docs](https://github.com/lerna/lerna#readme).
