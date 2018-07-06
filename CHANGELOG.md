# Changelog

> All notable changes to this project will be documented in this file.

## [1.2.1] - 2018-12-17
### Internal
  - Updated CircleCI to version 2

## [1.2.0] - 2018-12-17
### Feature
  - Add discord webhook support

## [1.1.3] - 2018-12-06
### Chore
  - Set node version to >=8 so that node 10+ can use it
  - updated dependencies

## [1.1.2] - 2017-11-11
### Chore
  - Updated dependencies

## [1.1.0] - 2017-11-10
### Feat
  - Add a `strict` flag to `push-changelog-update` that will silently succeed, but, output error if no changelog found without stopping the execution.

## [1.0.9] - 2017-11-08
### Fix
  - The main file and expose lastChangelogUpdate.

## [1.0.8] - 2017-10-11
### Added
  - Allow user to customize master branch and remote master branch, default to `origin/master`

## [1.0.7] - 2017-10-06
### Added
  - Commit hash in error message of `assertChangelogUpdate`

## [1.0.6] - 2017-10-06
### Changed
  - Fixed: config should be camelCase and not PascalCase in `package.json`

## [1.0.5] - 2017-10-06
### Changed
  - Fixed: incorrect `bin` specification in `package.json`

## [1.0.4] - 2017-10-06
### Changed
  - Made bin `assert-changelog-update` visible feedback optional with `-q` or `--quiet` option

## [1.0.3] - 2017-10-06
### Changed
  - Added some visible feedback for bin `assert-changelog-update`

## [1.0.2] - 2017-10-06
### Added
  - Initial add: see [README.md](README.md) for details.

### Note
  - Renamed from https://github.com/invisible-tech/release-note , no change in functionality

[1.0.2]: https://github.com/invisible-tech/changelog-update/releases/tag/v1.0.2
[1.0.3]: https://github.com/invisible-tech/changelog-update/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/invisible-tech/changelog-update/compare/v1.0.3...v1.0.4
[1.0.5]: https://github.com/invisible-tech/changelog-update/compare/v1.0.4...v1.0.5
[1.0.6]: https://github.com/invisible-tech/changelog-update/compare/v1.0.5...v1.0.6
[1.0.7]: https://github.com/invisible-tech/changelog-update/compare/v1.0.6...v1.0.7
[1.0.8]: https://github.com/invisible-tech/changelog-update/compare/v1.0.7...v1.0.8
[1.0.9]: https://github.com/invisible-tech/changelog-update/compare/v1.0.8...v1.0.9
[1.1.0]: https://github.com/invisible-tech/changelog-update/compare/v1.0.9...v1.1.0
[1.1.2]: https://github.com/invisible-tech/changelog-update/compare/v1.1.0...v1.2.0
[1.1.3]: https://github.com/invisible-tech/changelog-update/compare/v1.1.2...v1.1.3
[1.2.0]: https://github.com/invisible-tech/changelog-update/compare/v1.1.3...v1.2.0
