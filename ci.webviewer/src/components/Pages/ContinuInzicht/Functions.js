export function renderDescription(stationoptions, parameterName, description) {
  switch (stationoptions.descriptionType) {
    case 1:
      return (
        <div>
          <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
            Deze waterstand komt:
          </Typography>
          <Typography variant="h5" color="primary" style={{ fontWeight: 500, display: 'inline', margin: '0 8px' }}>
            {description}
          </Typography>
          <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
            voor
          </Typography>
        </div>
      )
    case 2:
    default:
      return (
        <div>
          <Typography variant="h5" color="primary" style={{ display: 'inline' }}>
            De status van de {parameterName} is:
          </Typography>
          <Typography variant="h5" color="primary" style={{ fontWeight: 500, display: 'inline', marginLeft: 8 }}>
            {description}
          </Typography>
        </div>
      )
  }
}