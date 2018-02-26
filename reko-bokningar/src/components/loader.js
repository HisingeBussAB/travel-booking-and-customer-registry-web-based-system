import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

fontawesome.library.add(faSpinner);

class Loader extends Component {
  
  

  render() {
    let style;
    let text;
    let size;
    if (this.props.fullScreen === true) {
      style = {
        color: '#0856fb',
        margin: '0 auto',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'center',
        width: '100%',
        zIndex: '20000',
      };
      const textstyle = {
        paddingTop: '12px',
      };
      text = <p style={textstyle}>Laddar...</p>;
      size = '6x';
    } else {
      style = {
        color: '#0856fb',
        margin: '0 auto',
        textAlign: 'center',
        width: '100%',
        paddingTop: '20px',
      };
      text = '';
      size = '2x';
    }
    
    if (this.props.error) {
      return (<div className="Loader" style={style}>Fel! Kunde inte ladda komponent!</div>);
    } else if (this.props.pastDelay) {
      return (<div className="Loader" style={style}><FontAwesomeIcon icon="spinner" pulse size={size} />{text}</div>);
    } else {
      return (null);
    }

  }
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  pastDelay: PropTypes.number,
  error: PropTypes.bool,
};

export default (Loader);