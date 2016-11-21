
import { white, blueGrey400, blueGrey900, red500, blue500, purple500 } from 'material-ui/styles/colors'

export const black = blueGrey900
export const grey = blueGrey400
export const red = red500
export const blue = blue500
export const purple = purple500

export const colors = {
  black,
  grey,
  white,
  purple,
  red,
  blue
}

export const css = `
body {
  font-family:
    '-apple-system',
    BlinkMacSystemFont,
    'Avenir Next',
    'Helvetica Neue',
    sans-serif;
  line-height: 1.5;
  margin: 0;
  background-color: ${colors.purple};
  color: ${colors.white};
  padding: 4rem 1rem;
}

h1, h2, h3, h4, h5 {
  font-weight: 600;
  line-height: 1.25;
  margin-top: 0;
  margin-bottom: .5rem;
}

h1 { font-size: 2rem }
h2 { font-size: 1.5rem }
h3 { font-size: 1.25rem }
h4 { font-size: 1rem }
h5 { font-size: .875rem }
`

const styles = {
  colors,
  css
}

export default styles
