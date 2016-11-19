
import React from 'react'
import css from 'next/css'

const Container = ({
  maxWidth = '48rem',
  ...props
}) => {
  const cx = {
    maxWidth,
    margin: 'auto',
    ...props.style
  }

  return (
    <main {...props} className={css(cx)} />
  )
}

export default Container
