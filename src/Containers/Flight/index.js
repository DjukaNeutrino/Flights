import React, { Component } from 'react';
import {Button} from "react-foundation";
import { withRouter } from "react-router-dom";

class Flight extends Component {

  state = {
    companyNamesSearch:[],
    isLoadedCompanyNamesSearch:true,
    error: undefined,
  };

  onBack = () => {
    this.props.history.push(`/`);
  };

  componentDidMount(){

    this.setState({
      isLoadedCompanyNamesSearch: false,
    });

    const company = this.props.location.state.flight.Op.replace(/\s/g,'').toLowerCase();
    const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${company}`;

    fetch(url)
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
          companyNamesSearch: result,
          isLoadedCompanyNamesSearch: true,
        })
      )
      .catch(error =>
        this.setState({
          isLoadedCompanyNamesSearch: true,
          error
        })
      );
  }

  render() {
    const flight = this.props.location.state.flight;
    const { companyNamesSearch, isLoadedCompanyNamesSearch } = this.state;
    let firstEl = companyNamesSearch[0];
    return (
      <div className="flightDetailsHolder clearfix">
        <p><b>Manufacturer: </b>{flight.Man}</p>
        <p><b>Model: </b>{flight.Mdl}</p>
        <p><b>From: </b>{flight.From}</p>
        <p><b>To: </b>{flight.To}</p>
        {!isLoadedCompanyNamesSearch &&
          <p className="searching">Searching for company logo...</p>}
        {firstEl &&
          <img src={firstEl.logo} alt="Company Logo"/>
        }
        {isLoadedCompanyNamesSearch && !firstEl &&
          <p className="error">Could not find company logo :-(</p>
        }
        <Button onClick={this.onBack} className="backButton">Back</Button>
      </div>
    );
  }
}

export default withRouter(Flight);
