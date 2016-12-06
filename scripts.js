var app = {

	addressInput: document.getElementsByClassName('input-address')[0],

	devDummyData: '<li class="rep-card mdl-card mdl-shadow--2dp"><div class="rep-card-content"><div class="left-content"><h3 class="rep-name mdl-card-title">Hakeem Jeffries</h3><p class="rep-title">Representative for New York&#x27;s 8th congressional district</p><p class="rep-affil">Democrat</p></div><div class="right-content"><img class="rep-image" src="https://theunitedstates.io/images/congress/225x275/J000294.jpg"/></div></div><a class="mdl-button call-button" href="tel:202-225-5936"><i class="material-icons mdl-list__item-icon mdl-color-text--white">phone</i>202-225-5936</a></li>',

	emptyStateHTML: '<div class="empty-state">Sorry, we were unable to find any results for that address.</div>',

	autocomplete: null,

	baseCivicsURL: 'https://www.googleapis.com/civicinfo/v2',

	/**
	 * Add tracking to the social share buttons
	 */
	bindSocialSharingClick: function() {
		var buttons = document.getElementsByClassName('social-share');

		for (var i = 0, length = buttons.length; i < length; i++) {
			buttons[i].addEventListener('click', function(e) {
				var shareMethod = e.currentTarget.getAttribute('share-method');

				app._trackEvent({
					eventAction: 'click',
					eventCategory: 'Social Share Button',
					eventLabel: shareMethod,
				});
			});
		}
	},

	/**
	 * Set up google address autocomplete on the address input
	 */
	initAutocomplete: function() {
		if (!google && !google.maps) {
			return;
		}

		this.autocomplete = new google.maps.places.Autocomplete(this.addressInput, {
			componentRestrictions: {
				country: 'us',
			}
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
	getAddressInputValue: function() {
		var address = this.autocomplete && this.autocomplete.getPlace();
		return (address && address.formatted_address)
			? address.formatted_address
			: this.addressInput.value
		;
	},

	/**
	 * Gets the address from the autocomplete and search
	 * for the representatives for that area
	 */
	searchRepresentativesByAddress: function(e) {
		var queryString = this._getRepSearchQueryString();
		var request = new XMLHttpRequest();

		// Don't search if input is empty
		if (this.getAddressInputValue().length === 0) {
			return false;
		}

		// var formattedAddress = this.getAddressInputValue();
		// if (this.addressInput.value !== formattedAddress) {
		// 	this.addressInput.value = formattedAddress;
		// }

		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) {
					var matchesResults = request.responseText.match(/ocd-division\/country:us\/(?:state|district):\w+\/cd:\d+/);

					// Handle the geographical weirdo DC
					if (!matchesResults) {
						matchesResults = request.responseText.match(/ocd-division\/country:us\/(?:state|district):\w+\//);
					}

					if (matchesResults) {
						var dataString = matchesResults[0];
						var state = dataString.match(/(?:state|district):(\w{2})/)[1];
						var districtNum = (state === 'dc') ? 1 : parseInt(dataString.match(/\d+$/)[0], 10);

						if (state && districtNum) {
							this.getRepresentativeData(state, districtNum);
						}
					} else {
						this._handleSearchError();
					}
				} else {
					this._handleSearchError();
				}
			}
		}.bind(app);

		request.open('GET', this.baseCivicsURL + '/representatives?' + queryString);

		request.send(null);

		if (e && e.currentTarget) {
			return false;
		}
	},

	_getRepSearchQueryString: function() {
		return this._encodeData({
			key: 'AIzaSyAQmMQg6Ti1XSiWULzRqJIdLS4lwS6muig',
			address: this.getAddressInputValue(),
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
		if (typeof state !== 'string' && typeof districtNum !== 'number') {
			return;
		}

		state = state.toUpperCase();

		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if(request.status === 200) {
					this.renderRepresentativeCard(request.responseText);
				} else {
					this._handleSearchError();
				}
			}
		}.bind(app);

		request.open('GET', 'http://cdn.usecalltoaction.com/' + state + '-' + districtNum + '.html');

		request.send(null);
	},

	/**
	 * Render the passed-in representative card HTML
	 * @param  {string} templateString
	 */
	renderRepresentativeCard: function(templateString) {
		templateString || (templateString = app.devDummyData);
		var repContainer = document.getElementById('repContentContainer');
		var repCardList = document.getElementById('repList');

		// Remove hidden class
		if (repContainer) {
			repContainer.classList = '';
		}

		// Add rep-card to page
		repCardList.innerHTML = templateString;

		this._bindCallButtonClick(repCardList.getElementsByClassName('call-button')[0]);
	},

	_bindCallButtonClick: function(element) {
		if (!element) {
			return;
		}

		element.addEventListener('click', function(e) {
			var button = e.currentTarget;
			var telNumber = button.getAttribute('href');

			// Remove all non-digit characters & change to an integer
			if (telNumber) {
				telNumber = parseInt(telNumber.replace(/\D/g, ''), 10);
			}

			app._trackEvent({
				eventAction: 'click',
				eventCategory: 'Call Button',
				eventLabel: 'Congressional Rep',
				eventValue: telNumber,
			});
		});
	},

	_handleSearchError: function() {
		this.renderRepresentativeCard(this.emptyStateHTML);
	},

	_testRenderRepresentativeCard: function() {
		this.renderRepresentativeCard(this.devDummyData);
	},

	/**
	 * Wrapper function for event tracking
	 * @param  {object} eventOptions
	 *      Possible values:
	 *      	{string} eventCategory *required
	 *      	{string} eventAction *required
	 *      	{string} eventLabel
	 *      	{integer} eventValue
	 *
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
	 */
	_trackEvent: function(eventOptions) {
		if (typeof ga !== 'function' || !eventOptions ||
			typeof eventOptions.eventCategory === 'undefined' ||
			typeof eventOptions.eventAction === 'undefined'
		) {
			return;
		}

		if (!eventOptions.hitType) {
			eventOptions.hitType = 'event';
		}

		ga('send', eventOptions);
	},
};

document.addEventListener('DOMContentLoaded', function() {

	app.addressInput = document.getElementsByClassName('input-address')[0];

	app.initAutocomplete();

	app.bindSocialSharingClick();
});
