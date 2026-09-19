// @ts-check

import prettier from '@inmediam/lint/prettier'
import react from '@inmediam/lint/react'
import tailwind from '@inmediam/lint/tailwind'

export default [
  ...react,
  ...tailwind({ tailwindConfig: 'tailwind.config.js' }),
  ...prettier(),

  {
    ignores: ['tailwind.config.js'],
  },
]
