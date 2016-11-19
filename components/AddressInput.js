
import React, { Component } from 'react'
import css from 'next/css'
import { forEach } from 'lodash'

import Card, { CardTitle } from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'

class AddressInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      suggestions: []
    }
  }

  componentDidMount () {
    this.service = new google.maps.places.AutocompleteService({
      componentRestrictions: {
        country: 'us'
      }
    })
  }

  onEdit = (value) => {
    this.service.getQueryPredictions({ input: value }, (suggestions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        console.error(status)
        return
      }
      let s = []
      forEach(suggestions, item => {
        s.push(item.description)
      })
      this.setState({
        value,
        suggestions: s
      })
    })
  }

  render () {
    const cx = {
      card: {
        padding: 16,
        textAlign: 'center'
      },
      input: {
        marginBottom: 16,
        maxWidth: '36rem'
      }
    }
    return (
      <Card style={cx.card}>
        <CardTitle title="What's your address?" />
        <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAQmMQg6Ti1XSiWULzRqJIdLS4lwS6muig&libraries=places' />
        <AutoComplete
          hintText='1600 Pennsylvania Ave, Washington, DC'
          dataSource={this.state.suggestions}
          onUpdateInput={this.onEdit}
          fullWidth={true}
          style={cx.input}
        />
      </Card>
    )
  }
}

export default AddressInput
