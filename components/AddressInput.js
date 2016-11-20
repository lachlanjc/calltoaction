
import React, { Component } from 'react'
import { forEach } from 'lodash'

import DivisionSearch from './DivisionSearch'

import Card, { CardTitle } from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import ActionSearch from 'material-ui/svg-icons/action/search'

class AddressInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
      showNext: false
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

  onSearch = (e) => {
    this.setState({ showNext: true })
  }

  render () {
    const cx = {
      card: {
        padding: 16,
        textAlign: 'center'
      },
      input: {
        display: 'block',
        maxWidth: '36rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      btn: {
        marginTop: 8,
        marginBottom: 16
      }
    }
    return (
      <div>
        <Card style={cx.card}>
          <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAQmMQg6Ti1XSiWULzRqJIdLS4lwS6muig&libraries=places' />
          <CardTitle title="What's your address?" />
          <AutoComplete
            hintText='1600 Pennsylvania Ave, Washington, DC'
            dataSource={this.state.suggestions}
            onUpdateInput={this.onEdit}
            fullWidth
            style={cx.input}
          />
          <RaisedButton
            label='Search'
            icon={<ActionSearch />}
            onClick={this.onSearch}
            style={cx.btn}
            primary
          />
        </Card>
        {this.state.showNext &&
          <DivisionSearch
            address={this.state.value}
          />
        }
      </div>
    )
  }
}

export default AddressInput
