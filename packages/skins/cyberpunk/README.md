# @linxin666/dsh-client-ui-skin-cyberpunk

English | [中文](README.zh.md)

A hot-pluggable cyberpunk night-city skin for the dsh web GUI.

- Neon cyan (#00e5ff) / magenta (#ff2d78) / electric purple (#9d4edd) /
  neon yellow (#ffd600) palette remapped onto the full dsh token set
  (`--dsw-static-*`, `--dsw-alias-*`, `--dsw-specific-*`, `--aion-*`).
- Pure-CSS neon backdrop: perspective grid + cyan/magenta glow over deep
  ink, zero image assets. The scrim follows the base light/dark theme and
  the skin-center background control (`--dsw-skin-scrim`).
- Translucent panes let the backdrop glow through; aionui panel and
  git-graph chrome get the same neon treatment.
- Injected favicon: cyan ring on deep ink (PNG data URL).

## Install

The bundle is the official dsh plugin shape:

```sh
dsh plugin --profile web add link:$(pwd)/packages/skins/cyberpunk
```

Mutual exclusion with other skins is managed by `scripts/dsh-skin`
(home-layer disabled rows); the skin-center GUI can try it on and apply it
in one click.

## Develop

```sh
pnpm build    # tsdown bundle -> lib/
pnpm test     # vitest (jsdom apply/dispose spec)
```

The CSS is a scoped `body[data-dsh-cyberpunk]` stylesheet injected by the
bundle loader; `apply()` owns the backdrop and favicon and retracts
everything on dispose.
