'use strict';

var app = {

	addressInput: document.getElementsByClassName('input-address')[0],

	autocomplete: null,

	baseCivicsURL: 'https://www.googleapis.com/civicinfo/v2',

	civicsKey: 'AIzaSyAQmMQg6Ti1XSiWULzRqJIdLS4lwS6muig',

	/**
	 * Set up google address autocomplete on the address input
	 */
	initAutocomplete: function() {
		if (!google && !google.maps) {
			return;
		}

		this.autocomplete = new google.maps.places.Autocomplete(this.addressInput, {
			//options
		});

		this._geolocateUserForAutocomplete();

		this.autocomplete.addListener('place_changed', this.searchRepresentativesByAddress.bind(this));
	},

	/**
	 * Find the users location and set it to the autocomplete
	 * for easier address searching on more local results
	 */
	_geolocateUserForAutocomplete: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});

				app.autocomplete.setBounds(circle.getBounds());
			});
		}
	},

	/**
	 * Returns the formatted address from the autocomplete input
	 * @return {string}
	 */
	getFormattedAddress: function() {
		var address = this.autocomplete && this.autocomplete.getPlace();

		return address ? address.formatted_address : '';
	},

	/**
	 * Gets the address from the autocomplete and search
	 * for the representatives for that area
	 */
	searchRepresentativesByAddress: function() {
		var queryString = this._getRepSearchQueryString();
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				var dataString = request.responseText.match(/ocd-division\/country:us\/state:\w+\/cd:\d+/)[0];
				var state = dataString.match(/state:(\w{2})/)[1];
				var districtNum = parseInt(dataString.match(/\d+$/)[0], 10);

				if (state && districtNum) {
					this.getRepresentativeData(state, districtNum);
				}
			} else {
				// handle errors
			}
		}.bind(app);

		request.open(
			'GET',
			this.baseCivicsURL + '/representatives?' + queryString
		);

		request.send(null);
	},

	_getRepSearchQueryString: function() {
		return this._encodeData({
			key: this.civicsKey,
			address: this.getFormattedAddress(),
			fields: 'divisions',
			includeOffices: false
		});
	},

	_encodeData: function(data) {
	    return Object.keys(data).map(function(key) {
	        return [key, data[key]].map(encodeURIComponent).join("=");
	    }).join("&");
	},

	/**
	 * Searches for the representative data by state & district
	 * number and then renders the rep-cards on success
	 * @param  {string} state
	 * @param  {string} districtNum
	 */
	getRepresentativeData: function(state, districtNum) {
		debugger;
	},
};

document.addEventListener('DOMContentLoaded', function() {

	app.addressInput = document.getElementsByClassName('input-address')[0];

	app.initAutocomplete();
});
