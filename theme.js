
import {
  red500, red700,
  blue500,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

const theme = {
  spacing: spacing,
  fontFamily: 'inherit',
  palette: {
    primary1Color: blue500,
    primary2Color: red700,
    primary3Color: grey400,
    accent1Color: red500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: red500
  }
}

export default theme
