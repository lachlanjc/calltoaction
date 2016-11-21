
import React, { Component, PropTypes } from 'react'
import { filter, keys, toNumber } from 'lodash'
import axios from 'axios'

import Card, { CardTitle } from 'material-ui/Card'
import RefreshIndicator from 'material-ui/RefreshIndicator'

class DivisionSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      district: null
    }
  }

  componentDidMount () {
    this.web = axios.create({
      baseURL: 'https://www.googleapis.com/civicinfo/v2?key=AIzaSyAQmMQg6Ti1XSiWULzRqJIdLS4lwS6muig'
    })
    this.search()
  }

  search () {
    this.web.get('/representatives', {
      params: {
        address: this.props.address,
        fields: 'divisions',
        includeOffices: false
      }
    })
    .then(response => {
      const key = filter(keys(response.divisions), k => {
        return k.match(/ocd-division\/country:us\/state:\w+\/cd:\d+/)
      })[0]
      const district = toNumber(key.match(/\d+$/)[0])
      this.setState({
        district
      })
      console.log(this.state)
    })
    .catch(error => {
      console.error(error)
    })
  }

  render () {
    const { status, address } = this.props
    let loadingStatus = status
    if (status == 'done') loadingStatus = 'hidden'
    return (
      <div>
        <RefreshIndicator
          size={48}
          status={loadingStatus}
        />
      </div>
    )
  }
}

DivisionSearch.propTypes = {
  address: PropTypes.string.isRequired
}

export default DivisionSearch
