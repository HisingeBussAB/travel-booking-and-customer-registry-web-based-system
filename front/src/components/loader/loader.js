import React, { Component } from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faFrown } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Textfit } from 'react-textfit'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Loader extends Component {
  render () {
    const {...props} = this.props

    const style = {
      width        : '100%',
      height       : '100%',
      padding      : '10px',
      textAlign    : 'center',
      display      : 'flex',
      flexDirection: 'column'
    }

    let firstline = 'Laddar'
    let secondline = null
    let icon = faSpinner
    let pulse = true

    const theLoader = (style, icon, pulse, firstline, secondline) =>
      <div className="Loader" style={style}>
        <Textfit style={{width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '6px'}} mode="single" forceSingleModeWidth max={200} min={4} throttle={900}><FontAwesomeIcon icon={icon} pulse={pulse} /></Textfit>
        {firstline === 'Laddar'
          ? <Textfit style={{width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2px'}} mode="single" forceSingleModeWidth max={40} min={4} throttle={900}><p className="loading-text">{firstline}</p></Textfit>
          : <Textfit style={{width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '2px'}} mode="single" forceSingleModeWidth max={35} min={9} throttle={900}><p>{firstline}</p></Textfit>
        }
        {firstline === 'Laddar' ? null
          : <Textfit style={{width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2px'}} mode="single" forceSingleModeWidth max={35} min={8} throttle={900}>{secondline}</Textfit>
        }

      </div>

    if (props.error !== null) {
      // When the loader has errored
      firstline = 'Ett fel inträffade. Komponenten kunde inte laddas!'
      secondline = 'Försök att ladda om sidan, tryck på F5.'
      icon = faFrown
      pulse = false
      return theLoader(style, icon, pulse, firstline, secondline)
    } else if (props.timedOut) {
      // When the loader has taken longer than the timeout
      firstline = 'Det tog längre tid än väntat att ladda komponenten.'
      secondline = 'Fortsätt vänta (om du är på en riktigt långsam anslutning) eller ladda om genom att trycka på F5.'
      icon = faFrown
      pulse = false
      return theLoader(style, icon, pulse, firstline, secondline)
    } else if (props.pastDelay) {
      // When the loader has taken longer than the delay
      firstline = 'Laddar'
      secondline = null
      icon = faSpinner
      pulse = true
      return theLoader(style, icon, pulse, firstline, secondline)
    } else {
      // When the loader has just started
      return null
    }
  }
}

/* eslint-disable react/boolean-prop-naming */
Loader.propTypes = {
  pastDelay: PropTypes.bool,
  error    : PropTypes.object,
  timedOut : PropTypes.bool
}
/* eslint-enable react/boolean-prop-naming */

export default connect(null, null)(Loader)
