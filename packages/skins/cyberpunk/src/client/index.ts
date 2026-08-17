/**
 * cyberpunk skin — the 《赛博霓虹》(Cyberpunk Neon) night-city theme,
 * a hot-pluggable client plugin for the dsh web GUI. apply() owns the whole
 * surface and retracts it on dispose (the ThemePresenter retraction
 * discipline: the plugin only ever removes what it wrote): the
 * `data-dsh-cyberpunk` body attribute the stylesheet is scoped on, the
 * night-city panorama backdrop (the user's own neon cityscape, embedded as
 * a WebP data URL, with a readability scrim chosen by the current theme,
 * swapped live on `data-ds-dark-theme` changes), and the injected favicon
 * (the night-city brand mark — cyan ring on deep ink, rasterized to PNG —
 * no SVG icons anywhere in the skin).
 * The palette remap and the translucent pane surfaces ride the bundle's
 * CSS-modules auto-inject (style tag owned by the loader, removed on entry
 * dispose). No services are injected: the skin needs only the DOM.
 */
import type { Context } from '@deepseek-ai/cordis'
import { CITY_BACKDROP, CYBER_ICON } from './art.ts'
// The palette remap + the translucent panes (incl. the [id='root']
// transparency that lets the backdrop show through) ride this
// stylesheet; the bundle preset inlines it as a loader-owned
// <style data-plugin-css> tag.
import './cyberpunk.module.css'

/** Light scrim: a light day-neon veil. The panorama is a night city, so the
 *  light theme needs a modest white veil to keep dark text legible on the
 *  illuminated pixels while the city still reads through. */
const SCRIM_LIGHT = [
  'linear-gradient(rgba(244, 251, 255, 0.42) 0%, rgba(240, 249, 255, 0.52) 60%, rgba(236, 247, 255, 0.58) 100%)',
].join(', ')

/** Dark scrim: a thin ink veil — the night-city take, light enough that the
 *  neon city stays vivid while text keeps its contrast. */
const SCRIM_DARK = [
  'linear-gradient(rgba(5, 8, 18, 0.2) 0%, rgba(8, 12, 26, 0.26) 60%, rgba(12, 17, 34, 0.32) 100%)',
].join(', ')

const BACKDROP_PROPERTIES = [
  'background-image',
  'background-position',
  'background-size',
  'background-attachment',
  'background-repeat',
] as const

/**
 * Apply the cyberpunk skin: body attribute, night-city backdrop (with a
 * live-swapping theme scrim), favicon. All writes are retracted by the
 * effect disposer on dispose. Backdrop writes go through the canonical
 * hyphenated CSSOM API (setProperty/getPropertyValue), so any prior value
 * round-trips verbatim on restore.
 * @param ctx - owning context (the effect lifecycle owns retraction).
 */
export function apply(ctx: Context): void {
  const body = document.body
  const previous = new Map<string, string>()
  for (const prop of BACKDROP_PROPERTIES) {
    previous.set(prop, body.style.getPropertyValue(prop))
  }
  body.dataset.dshCyberpunk = ''

  const setBackdrop = (): void => {
    const dark = body.dataset.dsDarkTheme !== undefined
    // The skin-center background control writes --dsw-skin-scrim (0..1); the
    // variable rides inside the veil gradient's alpha, so moving the
    // control re-rasters the backdrop instantly (0/unset keeps the stock
    // scrim exactly — an alpha-0 layer is invisible).
    const scrim = dark
      ? 'linear-gradient(rgba(5, 8, 18, var(--dsw-skin-scrim, 0)) 0%, rgba(5, 8, 18, var(--dsw-skin-scrim, 0)) 100%)'
      : 'linear-gradient(rgba(255, 255, 255, var(--dsw-skin-scrim, 0)) 0%, rgba(255, 255, 255, var(--dsw-skin-scrim, 0)) 100%)'
    const backdrop = `${scrim}, ${dark ? SCRIM_DARK : SCRIM_LIGHT}, url(${CITY_BACKDROP})`
    body.style.setProperty('background-image', backdrop)
    body.style.setProperty('background-position', 'center')
    body.style.setProperty('background-size', 'cover')
    body.style.setProperty('background-attachment', 'fixed')
    body.style.setProperty('background-repeat', 'no-repeat')
  }
  setBackdrop()

  // Swap the scrim live when the base theme system flips dark/light.
  const observer = new MutationObserver(setBackdrop)
  observer.observe(body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/png'
  favicon.href = CYBER_ICON
  document.head.append(favicon)

  ctx.effect(() => () => {
    delete body.dataset.dshCyberpunk
    observer.disconnect()
    for (const [prop, value] of previous) {
      body.style.setProperty(prop, value)
    }
    favicon.remove()
  }, 'ui-skin-cyberpunk: night-city backdrop')
}
