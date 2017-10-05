# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2017-10-05
### Added
  - New method: `last-changelog-additions` see [README.md](README.md) for more details.

## [2.0.0] - 2017-10-04
### Changed
  - Sets some defaults so that it works without adding anything to `package.json`
  - Optionally loads `dotenv` if it is present
  - Separates out the `bin` files so that nothing is run on `require`, so that you can use the methods programmatically
  - *BREAKING*: Changes config object in `package.json` to use camelCase instead of kebab-case

[2.0.0]: https://github.com/invisible-tech/release-note/releases/tag/v1.0.0

