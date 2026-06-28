import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

export const InitTheme: React.FC = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){function g(){var q='(prefers-color-scheme: dark)';var m=window.matchMedia(q);if(typeof m.matches==='boolean'){return m.matches?'dark':'light';}return null;}function v(t){return t==='light'||t==='dark';}var s='${defaultTheme}';var p=window.localStorage.getItem('${themeLocalStorageKey}');if(v(p)){s=p;}else{var i=g();if(i){s=i;}}document.documentElement.setAttribute('data-theme',s);})();`,
      }}
      id="theme-script"
    />
  )
}
