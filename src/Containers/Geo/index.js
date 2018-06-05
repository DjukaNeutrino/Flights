import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import earthLoader from "../../earth.gif";
import airplaneIcon from "../../airplaneIcon.png";

class Geo extends Component {

  state = {
    flights:[],
    isLoadedFlights:true,
    error: undefined,
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPosition, this.showError);
    } else {
      this.setState({
        error:{message:"Geolocation is not supported by this browser."}
      });
    }
  };

  getPosition = (position) => {

    this.setState({
      isLoadedFlights: false,
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const url = `http://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=${lat}&lng=${lng}&fDstL=0&fDstU=100`;
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyUrl + url)
      .then(response => {
        return response.json()
          .then(data => {
            if(response.ok){
              return data
            }else{
              return Promise.reject({status: response.status, data});
            }
          });
      })
      .then(result =>
        this.setState({
          isLoadedFlights: true,
          flights: result.acList,
          error:undefined
        })
      )
      .catch(error =>
        this.setState({
          isLoadedFlights: true,
          error
        })
      );
  };

  showError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.setState({
          error:{message:"You must allow Geolocation in order to use this App."}
        });
        break;
      case error.POSITION_UNAVAILABLE:
        this.setState({
          error:{message:"Location information is unavailable."}
        });
        break;
      case error.TIMEOUT:
        this.setState({
          error:{message:"The request to get user location timed out."}
        });
        break;
      case error.UNKNOWN_ERROR:
        this.setState({
          error:{message:"An unknown error occurred."}
        });
        break;
    }
  };

  updateLocation = () => {
    this.setState({
      flights: []
    });
    this.getLocation();
  };

  onViewFlightDetails = (item) => {
    this.props.history.push({
      pathname: `/${item.Id}`,
      state: { flight: item }
    });
  };

  componentDidMount(){
    this.getLocation();
    setInterval(this.updateLocation, 60000);
  };

  render() {
    const { flights, isLoadedFlights, error } = this.state;
    flights.sort(function(a,b) {return (a.Alt > b.Alt) ? -1 : ((b.Alt > a.Alt) ? 1 : 0);} );
    return (
      <div>
        {!isLoadedFlights && <div className="loaderHolder" ><img src={earthLoader} alt=""/></div>}
        {error && <div className="errorHolder">{error.message}</div>}
        <ul className="list">
          {flights.length > 0 && flights.map( (item) => {
            return  <li key={item.Id} className="list-item" onClick={() => this.onViewFlightDetails(item)}>
                      <img src={airplaneIcon} alt="Airplane Icon" className={item.Trak > 180 ? 'reverse' : ''}/>
                      <p><b>Altitude: </b>{item.Alt} <i>ft</i></p>
                      <p><b>Flight Number: </b>{item.CNum}</p>
                    </li>
          })}
        </ul>
      </div>
    );
  }
}

export default withRouter(Geo);
