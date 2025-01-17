import * as React from 'react'

import { ButtonInsideButtonContext } from '../contexts/ButtonInsideButtonContext'
import { TamaguiInternalConfig, TamaguiProviderProps } from '../types'
import { TextAncestorProvider } from '../views/TextAncestorContext'
import { ThemeProvider } from '../views/ThemeProvider'

export function createTamaguiProvider(config: TamaguiInternalConfig) {
  return function TamaguiProvider({
    disableInjectCSS,
    children,
    ...themePropsProvider
  }: TamaguiProviderProps) {
    // inject CSS if asked to (not SSR compliant)
    if (typeof document !== 'undefined') {
      React.useLayoutEffect(() => {
        if (disableInjectCSS) return
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(config.getCSS()))
        document.head.appendChild(style)
        return () => {
          document.head.removeChild(style)
        }
      }, [disableInjectCSS])
    }

    return (
      <ButtonInsideButtonContext.Provider value={false}>
        <TextAncestorProvider>
          <ThemeProvider
            themes={config.themes}
            defaultTheme={config.defaultTheme || 'light'}
            themeClassNameOnRoot={config.themeClassNameOnRoot}
            disableRootThemeClass={config.disableRootThemeClass}
            {...themePropsProvider}
          >
            {children}
          </ThemeProvider>
        </TextAncestorProvider>
      </ButtonInsideButtonContext.Provider>
    )
  }
}
