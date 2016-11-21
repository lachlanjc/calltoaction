'use strict';

var app = {

	addressInput: document.getElementsByClassName('input-address')[0],

	autocomplete: null,

	/**
	 * Set up google address autocomplete on the address input
	 */
	initAutocomplete: function() {
		if (!google && !google.maps) {
			return;
		}

		app.autocomplete = new google.maps.places.Autocomplete(app.addressInput, {
			//options
		});

		app._geolocateUserForAutocomplete();

		app.autocomplete.addListener('place_changed', app.searchRepresentativesByAddress);
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
	 * Gets the address from the autocomplete and search
	 * for the representatives for that area
	 */
	searchRepresentativesByAddress: function() {
		var address = app.getFormattedAddress();

		if (!address) {
			return;
		}
	},

	/**
	 * Returns the formatted address from the autocomplete input
	 * @return {string}
	 */
	getFormattedAddress: function() {
		var address = app.autocomplete && app.autocomplete.getPlace();

		return address ? address.formatted_address : '';
	}
};

document.addEventListener('DOMContentLoaded', function() {

	app.addressInput = document.getElementsByClassName('input-address')[0];

	app.initAutocomplete();
});
