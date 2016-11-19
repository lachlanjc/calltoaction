
import React from 'react'
import { insertRule } from 'next/css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { css } from '../styles'
import theme from '../theme'

import Container from './Container'
import Header from './Header'

const Body = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    <Container>
      <Header />
    </Container>
  </MuiThemeProvider>
)

insertRule(css)

export default Body
