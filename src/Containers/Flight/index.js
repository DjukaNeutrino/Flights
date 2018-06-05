import React, { Component } from 'react';

class Flight extends Component {

  render() {
    const flight = this.props.location.state.flight;
    return (
      <div className="flightDetailsHolder">
        <p><b>Manufacturer: </b>{flight.Man}</p>
        <p><b>Model: </b>{flight.Mdl}</p>
        <p><b>From: </b>{flight.From}</p>
        <p><b>To: </b>{flight.To}</p>
        <img src={`//logo.clearbit.com/${flight.Op}`} alt="Company Logo"/>
      </div>
    );
  }
}

export default Flight;
