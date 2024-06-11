# octoherd-script-remove-branches-config-semantic-release

> remove 'release.branches' from Semantic Release (https://github.com/semantic-release/semantic-release) configuration in package.json

[![@latest](https://img.shields.io/npm/v/octoherd-script-remove-branches-config-semantic-release.svg)](https://www.npmjs.com/package/octoherd-script-remove-branches-config-semantic-release)
[![Build Status](https://github.com/oscard0m/octoherd-script-remove-branches-config-semantic-release/workflows/Test/badge.svg)](https://github.com/oscard0m/octoherd-script-remove-branches-config-semantic-release/actions?query=workflow%3ATest+branch%3Amain)

## Usage

Minimal usage

```js
npx octoherd-script-remove-branches-config-semantic-release@latest
```

Pass all options as CLI flags to avoid user prompts

```js
npx octoherd-script-remove-branches-config-semantic-release@latest \
  -T ghp_0123456789abcdefghjklmnopqrstuvwxyzA \
  -R "oscard0m/*"
```

## Options

| option                       | type             | description                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--octoherd-token`, `-T`     | string           | A personal access token ([create](https://github.com/settings/tokens/new?scopes=repo)). Script will create one if option is not set                                                                                                         |
| `--octoherd-repos`, `-R`     | array of strings | One or multiple space-separated repositories in the form of `repo-owner/repo-name`. `repo-owner/*` will find all repositories for one owner. `*` will find all repositories the user has access to. Will prompt for repositories if not set |
| `--octoherd-bypass-confirms` | boolean          | Bypass prompts to confirm mutating requests                                                                                                                                                                                                 |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
