export const size = {
  mobile: '770px',
  tablet: '1023px',
  laptop: '1460px'
}

export const theme = {
  mobile: `(max-width: ${size.mobile})`,
  tablet: `(min-width: ${size.mobile}) and (max-width: ${size.tablet})`,
  laptop: `(min-width: ${size.tablet}) and (max-width: ${size.laptop})`,
  desktop: `(min-width: ${size.laptop})`
}
