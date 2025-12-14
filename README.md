# VRChat Wiki (themes & scripts)

Custom themes and scripts for the [VRChat Wiki](https://wiki.vrchat.com/), built with Vite and deployed to MediaWiki system pages.

## Contributing

This repository falls under the [VRChat Wiki Guidelines & Policies](https://wiki.vrchat.com/wiki/VRCWiki:Guidelines). Infringements may affect your ability to interact with the Wiki.

[Maintainers](https://wiki.vrchat.com/wiki/VRCWiki:Maintainers) are given commit permissions at-request and can make changes freely. If you're a maintainer and would like access, reach out to an [Organizer](https://wiki.vrchat.com/wiki/VRCWiki:Organizers) through the traditional channels.

Anyone is welcome to contribute via pull requests. For larger changes or new features, consider opening an issue first to discuss the approach.

### Setup

This project uses [pnpm](https://pnpm.io/). Follow their [install instructions](https://pnpm.io/installation) to set it up.

```bash
pnpm install
```

### Development

```bash
pnpm build    # Build to dist/
pnpm lint     # Check for issues (don't commit with lint issues please!)
```

### Testing Locally

Use a browser extension like [Stylus](https://github.com/openstyles/stylus) to inject your built CSS, or copy the output to your [personal wiki pages](https://www.mediawiki.org/wiki/Manual:Interface/Stylesheets#User_styles).

### Submitting Changes

1. Run `pnpm build` and `pnpm lint` before committing.
2. Pull requests are preferred, but maintainers may commit directly.

Once merged, CI will automatically deploy your changes to the corresponding MediaWiki pages.

## Project Structure

```
src/
├─ index.ts              # Main entry point (MediaWiki:Common.js)
├─ ...
├─ templates/            # Wiki template implementations
└─ themes/
    ├─ any/              # Shared styles (all skins)
    │   ├─ index.scss    # Entry point (MediaWiki:Common.css)
    │   ├─ experiments/  # Non-final changes, usually actively being discussed.
    │   └─ ...
    └─ timeless/         # Timeless skin overrides
        ├─ index.scss    # Entry point (MediaWiki:Timeless.css)
        └─ ...
```

## Build Configuration

The [Vite config](./vite.config.ts) uses `input` keys that match MediaWiki system page names. The output filename corresponds directly to the wiki page where it should be deployed (e.g., `dist/MediaWiki:Common.js` goes to `MediaWiki:Common.js` on the wiki).

See MediaWiki's documentation on [interface JavaScript](https://www.mediawiki.org/wiki/Manual:Interface/JavaScript) and [interface stylesheets](https://www.mediawiki.org/wiki/Manual:Interface/Stylesheets) for more details.

```ts
export default defineConfig({
	// ...
	input: {
		"MediaWiki:Common": "./src",
		"MediaWiki:Timeless": "./src/themes/timeless/index.scss"
	}
});
```
