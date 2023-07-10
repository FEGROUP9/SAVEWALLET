export const size = {
  mobile: '770px',
  tabletS: '1023px',
  tabletM: '1220px',
  tabletL: '1280px',
  laptop: '1460px',
  desktop: '1700px'
}

export const theme = {
  mobile: `(max-width: ${size.mobile})`,
  tabletS: `(min-width:${size.mobile}) and(max-width: ${size.tabletS})`,
  tabletM: `(min-width:${size.tabletS}) and(max-width: ${size.tabletM})`,
  tabletL: `(min-width:${size.tabletM}) and(max-width: ${size.tabletL})`,
  laptop: `(min-width:${size.tabletL}) and (max-width: ${size.laptop})`,
  desktop: `(min-width: ${size.laptop}) and (max-width: ${size.desktop})`
}
