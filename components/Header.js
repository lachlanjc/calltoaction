
import React from 'react'
import css from 'next/css'

const Header = () => (
  <header className={css(cx.root)}>
    <h1 className={css(cx.header)}>Call to Action</h1>
    <p>Call your representatives in Congress.</p>
  </header>
)

const cx = {
  root: {
    textAlign: 'center',
    marginBottom: 48
  },
  header: {
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    fontSize: '2.5rem'
  }
}

export default Header
