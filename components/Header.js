
import React from 'react'
import css from 'next/css'

import { white, blue500 } from 'material-ui/styles/colors'

const Header = () => (
  <header className={css(cx.root)}>
    <div className={css(cx.container)}>
      <h1 className={css(cx.text)}>Call to Action</h1>
      <p className={css(cx.text)}>
        Call your representatives in Congress.
      </p>
    </div>
  </header>
)

const cx = {
  root: {
    paddingTop: 64,
    paddingBottom: 64,
    backgroundColor: blue500
  },
  container: {
    maxWidth: '48rem',
    margin: 'auto'
  },
  text: {
    color: white,
    marginTop: 0,
    marginBottom: 16
  }
}

export default Header
