import {
  AllRules,
  getStylesAtomic,
  stylePropsText,
  stylePropsTransform,
  validStyles,
} from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { isWeb } from '../constants/platform'
import { getMedia, mediaQueryConfig } from '../hooks/useMedia'
import { StaticConfigParsed, ThemeObject } from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixNativeShadow } from './fixNativeShadow'
import { insertStyleRule } from './insertStyleRule'

export type SplitStyles = ReturnType<typeof getSplitStyles>

// TODO run over this, should be able to cut it down quite a bit

export const getSplitStyles = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeObject
) => {
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: Record<string, any> = {}
  const style: any[] = []
  let pseudos: { hoverStyle?: ViewStyle; pressStyle?: ViewStyle } | null = null
  let cur: ViewStyle | null = null
  let classNames: string[] | null = null
  for (const keyInit in props) {
    // be sure to sync next few lines below to getSubStyle (*1)
    const valInit = props[keyInit]

    // media
    if (keyInit[0] === '$') {
      const mediaKey = keyInit.slice(1)

      if (!mediaQueryConfig[mediaKey]) {
        // this isn't a media key, pass through
        viewProps[keyInit] = valInit
        continue
      }

      // dont check if media is active, we just apply *all* media styles
      // we combine the media props on top regular props, could proxy this
      // TODO test proxy here instead of merge
      const mediaProps = { ...props, ...valInit }
      // TODO media + hover
      const mediaStyle = getSubStyle(valInit, staticConfig, theme)
      const mediaStyles = getStylesAtomic(mediaStyle)
      if (process.env.NODE_ENV === 'development') {
        if (props['debug']) {
          console.log('mediaStyles', keyInit, { mediaProps, mediaStyle, mediaStyles })
        }
      }
      for (const style of mediaStyles) {
        const out = createMediaStyle(style, mediaKey, mediaQueryConfig)
        classNames = classNames || []
        classNames.push(out.identifier)
        AllRules.add(out.styleRule)
        insertStyleRule(out.styleRule)
        if (process.env.NODE_ENV === 'development' && props['debug']) {
          console.log('mediaProp', style.identifier, out, mediaProps, mediaStyle, mediaStyles)
        }
      }
      continue
    }

    // pseudo
    const isPseudo =
      keyInit === 'hoverStyle' || keyInit === 'pressStyle' || keyInit === 'focusStyle'
    if (isPseudo) {
      if (!valInit) continue
      pseudos = pseudos || {}
      pseudos[keyInit] = getSubStyle(valInit, staticConfig, theme)
      continue
    }

    const out = staticConfig.propMapper(keyInit, valInit, theme)
    const expanded = out === true || !out ? [[keyInit, valInit]] : Object.entries(out)
    for (const [key, val] of expanded) {
      // const val = valueMap(valInit) ?? valInit
      const keyFirstChar = key[0]
      if (key === 'style' || (keyFirstChar === '_' && key.startsWith('_style'))) {
        if (cur) {
          // process last
          fixNativeShadow(cur)
          style.push(cur)
          cur = null
        }
        fixNativeShadow(val)
        style.push(val)
        continue
      }
      // expand flex so it merged with flexShrink etc properly
      // TODO this shouldn't be here...
      if (key === 'flex') {
        cur = cur || {}
        // see spec for flex shorthand https://developer.mozilla.org/en-US/docs/Web/CSS/flex
        // TODO this fixed a behavior but need to find / document / test
        Object.assign(cur, {
          flexGrow: val,
          flexShrink: 1,
        })
        continue
      }
      if (!isWeb && key === 'pointerEvents') {
        viewProps[key] = val
        continue
      }
      if (validStyleProps[key]) {
        // transforms
        if (key in stylePropsTransform) {
          cur = cur || {}
          mergeTransform(cur, key, val)
          continue
        }
        cur = cur || {}
        cur[key] = val
        continue
      }
      // TODO this blacklist should be configurable + better set up
      if (!blacklistProps[key]) {
        viewProps[key] = val
      }
    }
  }
  // push last style
  if (cur) {
    fixNativeShadow(cur)
    style.push(cur)
  }

  if (process.env.NODE_ENV === 'development') {
    if (props['debug']) {
      console.log(' style debug:', { props, viewProps, style }, getMedia())
    }
  }

  return {
    viewProps,
    style,
    pseudos,
    classNames,
  }
}

const getSubStyle = (
  styleIn: Object,
  staticConfig: StaticConfigParsed,
  theme: ThemeObject
): ViewStyle => {
  const styleOut: ViewStyle = {}
  for (const key in styleIn) {
    // be sure to sync next few lines below to loop above (*1)
    const val = styleIn[key]
    const out = staticConfig.propMapper(key, val, theme)
    const expanded = out === true || !out ? [[key, val]] : Object.entries(out)
    for (const [skey, sval] of expanded) {
      // const sval = valueMap(valInit)
      if (skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = sval
      }
    }
  }
  fixNativeShadow(styleOut)
  return styleOut
}

// temp
const blacklistProps = {
  tag: true,
  debug: true,
  onPress: true,
  spacing: true,
  hitSlop: true,
  ...validStyles,
  ...stylePropsText,
}

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const mergeTransform = (obj: ViewStyle, key: string, val: any) => {
  const transform = obj.transform
    ? Array.isArray(obj.transform)
      ? obj.transform
      : [obj.transform]
    : []
  // @ts-expect-error
  transform.push({ [mapTransformKeys[key] || key]: val })
  obj.transform = transform
}