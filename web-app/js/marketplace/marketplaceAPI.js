/**
 * @namespace
 */
var Ozone = Ozone || {};

/**
 * @namespace
 */
Ozone.marketplace = Ozone.marketplace || {};

/**
 * @namespace
 */
Ozone.marketplace.util = Ozone.marketplace.util || {};

Ozone.marketplace.util.owfversion = Ozone.version.owfversion;
 
var url = Ozone.config.marketplaceLocation;

// ensure url does not have a trailing forward slash
if (url.charAt(url.length-1) == "/") {
	url = url.slice(0, url.length-1);
}
/**
 * @description Retrieves the listings matching the specified criteria from marketplace
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} [max] The maximum number of listings to return. Default is 10
 *   @config {Integer} [offset] The offset relative to 0 of the first listing to return
 *   @config {String} [sort] The property name to sort by. Valid values are title, types_title, state_title, versionName, releaseDate, avgRate, totalVotes, author_username, author_displayName, techPoc, dependencies, description, approvalStatus, docUrl, imageLargeUrl, imageSmallUrl, installUrl, launchUrl, organization, requirements, screenshot1Url, screenshot2Url, id, and uuid
 *   @config {String} [order] The order of the results. Use "asc" for ascending or "desc" for descending
 *   @config {Integer} [categories_id] Category ID, only return listings assigned to this category
 *   @config {Integer} [state_id] State ID, only return listings assigned to this state
 *   @config {Integer} [types_id] Type ID, only return listings assigned to this type
 *   @config {String} [title] Search for listings by title. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [description] Search for listings by description. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [author_displayName] Search for listings by the author's display name. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [author_username] Search for listings by the author's user name. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {Function} success The function to be called if the listings are successfully retrieved from marketplace. This function is passed the 
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the array of listings<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getListings({
 *   success: function onSuccess(json) {
 *     var listings = document.getElementById("listings");
 *     for (var i=0; i&lt;json.data.length; i++) {
 *       var li = document.createElement("li");
 *       li.innerHTML = json.data[i].title;
 *       listings.appendChild(li);
 *     }
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting listings! Status Code: " + status + " . Error message: " + error);
 *   },
 *   offset: 0,
 *   sort: "title",
 *   order: "desc",
 *   max: 5,
 *   title: "Listing"
 * });
 *
 */
Ozone.marketplace.util.getListings = function(params) {
	var success = params.success;
	var failure = params.failure;
    var timeout = params.timeout;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
    delete params.timeout;

  //Ozone.util.Transport.send(url +'/public/serviceItem', 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/serviceItem',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      timeout : timeout,
      content : params
    });
};

/**
 * @description Retrieves the OWF compatible listings matching the specified criteria from marketplace
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} [max] The maximum number of listings to return. Default is 10
 *   @config {Integer} [offset] The offset relative to 0 of the first listing to return
 *   @config {String} [sort] The property name to sort by. Valid values are title, types_title, state_title, versionName, releaseDate, avgRate, totalVotes, author_username, author_displayName, techPoc, dependencies, description, approvalStatus, docUrl, imageLargeUrl, imageSmallUrl, installUrl, launchUrl, organization, requirements, screenshot1Url, screenshot2Url, id, and uuid
 *   @config {String} [order] The order of the results. Use "asc" for ascending or "desc" for descending
 *   @config {Integer} [categories_id] Category ID, only return listings assigned to this category
 *   @config {Integer} [state_id] State ID, only return listings assigned to this state
 *   @config {Integer} [types_id] Type ID, only return listings assigned to this type
 *   @config {String} [title] Search for listings by title. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [description] Search for listings by description. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [author_displayName] Search for listings by the author's display name. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {String} [author_username] Search for listings by the author's user name. Search for listings containing a search term by surrounding the search term with asterisks, for example *sky* will return sky, blue sky, and sky blue. For an exact match specify the desired search term without asterisks, for example â€œskyâ€� will only return sky.
 *   @config {Function} success The function to be called if the listings are successfully retrieved from marketplace. This function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the array of listings<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getOwfCompatibleItems({
 *   success: function onSuccess(json) {
 *     var listings = document.getElementById("listings");
 *     for (var i=0; i&lt;json.data.length; i++) {
 *       var li = document.createElement("li");
 *       li.innerHTML = json.data[i].title;
 *       listings.appendChild(li);
 *     }
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting listings! Status Code: " + status + " . Error message: " + error);
 *   },
 *   offset: 0,
 *   sort: "title",
 *   order: "desc",
 *   max: 5,
 *   title: "Listing"
 * });
 *
 */
Ozone.marketplace.util.getOwfCompatibleItems = function(params) {
	var success = params.success;
	var failure = params.failure;
    var timeout = params.timeout;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
    delete params.timeout;

    //Marketplace.util.Transport.send(url +'/public/serviceItem/getOwfCompatibleItems', 'GET', success, failure, params);
	Ozone.util.Transport.send({
      url : url +'/public/serviceItem/getOwfCompatibleItems',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      timeout : timeout,
      content : params
    });
};

/**
 * @description Retrieves the list of categories from marketplace
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} [max] The maximum number of categories to return. Default is 100
 *   @config {Integer} [offset] The offset relative to 0 of the first category to return
 *   @config {String} [sort] The property name to sort by. Valid values are title and description.
 *   @config {String} [order] The order of the results. Use "asc" for ascending or "desc" for descending
 *   @config {Function} success The function to be called if the categories are successfully retrieved from marketplace. This function is passed the 
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the array of categories<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getCategories({
 *   success: function onSuccess(json) {
 *     var cats = document.getElementById("categories");
 *     for (var i=0; i&lt;json.data.length; i++) {
 *       var li = document.createElement("li");
 *       li.innerHTML = json.data[i].title;
 *       cats.appendChild(li);
 *     }
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting categories! Status Code: " + status + " . Error message: " + error);
 *   },
 *   offset: 5,
 *   sort: "title",
 *   order: "desc",
 *   max: 7
 * });
 *
 */
Ozone.marketplace.util.getCategories = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;

    //Ozone.util.Transport.send(url +'/public/category', 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/category',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the list of states from marketplace
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} [max] The maximum number of states to return. Default is 100
 *   @config {Integer} [offset] The offset relative to 0 of the first state to return
 *   @config {String} [sort] The property name to sort by. Valid values are title, description and isPublished.
 *   @config {String} [order] The order of the results. Use "asc" for ascending or "desc" for descending
 *   @config {Function} success The function to be called if the states are successfully retrieved from marketplace. This function is passed the 
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the array of states<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getStates({
 *   success: function onSuccess(json) {
 *     var states = document.getElementById("states");
 *     for (var i=0; i&lt;json.data.length; i++) {
 *       var li = document.createElement("li");
 *       li.innerHTML = json.data[i].title;
 *       states.appendChild(li);
 *     }
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting states! Status Code: " + status + " . Error message: " + error);
 *   },
 *   offset: 0,
 *   sort: "title",
 *   order: "asc",
 *   max: 4
 * });
 *
 */
Ozone.marketplace.util.getStates = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
	//Ozone.util.Transport.send(url +'/public/state', 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/state',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the list of types from marketplace
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} [max] The maximum number of types to return. Default is 100
 *   @config {Integer} [offset] The offset relative to 0 of the first type to return
 *   @config {String} [sort] The property name to sort by. Valid values are title, description , roleAccess, ozoneAware, isWidget, hasLaunchUrl, hasIcons, and hasLayouts
 *   @config {String} [order] The order of the results. Use "asc" for ascending or "desc" for descending
 *   @config {Function} success The function to be called if the types are successfully retrieved from marketplace. This function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the array of types<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getTypes({
 *   success: function onSuccess(json) {
 *     var types = document.getElementById("types");
 *     for (var i=0; i&lt;json.data.length; i++) {
 *       var li = document.createElement("li");
 *       li.innerHTML = json.data[i].title;
 *       types.appendChild(li);
 *     }
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting states! Status Code: " + status + " . Error message: " + error);
 *   },
 *   offset: 0,
 *   sort: "title",
 *   order: "asc",
 *   max: 5
 * });
 *
 */
Ozone.marketplace.util.getTypes = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
	//Ozone.util.Transport.send(url +'/public/types', 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/types',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the category from marketplace with a specific id
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} id The category identifier
 *   @config {Function} success The function to be called if the category is successfully retrieved from marketplace. This function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the returned category<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getCategory({
 *   success: function onSuccess(json) {
 *     var cat = document.getElementById("category");
 *     cat.innerHTML = json.data.title;
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting category! Status Code: " + status + " . Error message: " + error);
 *   },
 *   id: 1
 * });
 *
 */
Ozone.marketplace.util.getCategory = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
	//Ozone.util.Transport.send(url +'/public/category/' + params.id, 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/category/',
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the state from marketplace with a specific id
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} id The state identifier
 *   @config {Function} success The function to be called if the state is successfully retrieved from marketplace. This function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the returned state<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getState({
 *   success: function onSuccess(json) {
 *     var state = document.getElementById("state");
 *     state.innerHTML = json.data.title;
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting state! Status Code: " + status + " . Error message: " + error);
 *   },
 *   id: 1
 * });
 *
 */
Ozone.marketplace.util.getState = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
	//Ozone.util.Transport.send(url +'/public/state/' + params.id, 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url +'/public/state/' + params.id,
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the type from marketplace with a specific id
 * @param {Object} params An object which may contain the following properties:
 *   @config {Integer} id The type identifier
 *   @config {Function} success The function to be called if the types are successfully retrieved from marketplace. This function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the returned type<br>
 *   @config {Function} [failure] The function to be called if an error occurs. If this function is not specified a default error message will be displayed.
 *                                This function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getType({
 *   success: function onSuccess(json) {
 *     var type = document.getElementById("type");
 *     type.innerHTML = json.data.title;
 *   },
 *   failure: function onGetFailure(error,status) {
 *     alert("Got an error getting type! Status Code: " + status + " . Error message: " + error);
 *   },
 *   id: 1
 * });
 *
 */
Ozone.marketplace.util.getType = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
//	Ozone.util.Transport.send(url +'/public/types/' + params.id, 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url + '/public/types/' + params.id,
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the detailed listings for a serviceItem by id from marketplace
 * @param {Object} params This object contains the following properties:
 *   @config {Integer} id The serviceItem identifier
 *   @config {Function} success The callback function that is called when the serviceItem is successfully retrieved from marketplace. The function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the returned item<br>
 *   @config {Function} [failure] The callback function that is called when an error occurs. If this function is not specified a default error message will be displayed.
 *                                This Function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getDetailListings({
 *   success: function onSuccess(json) {
 *     var title = document.getElementById("title");
 *     title.innerHTML = json.data.name;
 *   },
 *   failure: function onFailure(error,status){
 *     alert("Got an error while retrieving serviceItem by id. Status Code: " + status + ". Error message: " + error);
 *   },
 *   id: 2
 * });
 */
Ozone.marketplace.util.getDetailListings = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

	delete params.success;
	delete params.failure;
	//Ozone.util.Transport.send(url + '/public/serviceItem/' + params.id, 'GET', success, failure, params);
    Ozone.util.Transport.send({
      url : url + '/public/serviceItem/' + params.id,
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};

/**
 * @description Retrieves the tree of required listings for a serviceItem by id from marketplace
 * @param {Object} params This object contains the following properties:
 *   @config {Integer} id The serviceItem identifier
 *   @config {Function} success The callback function that is called when the required listings are successfully retrieved from marketplace. The function is passed the
 *                                following parameters:<br>
 *                                  <br>
 *                                  json {total, data} where total is the total possible return values (based on params), and data is the returned item<br>
 *   @config {Function} [failure] The callback function that is called when an error occurs. If this function is not specified a default error message will be displayed.
 *                                This Function is passed back the following parameters:<br>
 *                                  <br>
 *                                  error: String<br>
 *                                  The error message<br>
 *                                  <br>
 *                                  Status: The HTTP Status code<br>
 *                                  500: An unexpected error occurred.<br>
 * @example
 * Ozone.marketplace.util.getRequiredListings({
 *   success: function onSuccess(json) {
 *     var title = document.getElementById("title");
 *     title.innerHTML = json.data[0].title;
 *   },
 *   failure: function onFailure(error,status){
 *     alert("Got an error while retrieving serviceItem by id. Status Code: " + status + ". Error message: " + error);
 *   },
 *   id: 2
 * });
 */
Ozone.marketplace.util.getOWFRequiredListings = function(params) {
	var success = params.success;
	var failure = params.failure;

    //send mp version we configured to use
    params.mpversion = Ozone.version.mpversion;

    var version = parseFloat(params.mpversion);
    var uri = version < 2.3 ? '/public/serviceItem/' : '/public/serviceItem/getOWFRequiredItems/';

	delete params.success;
	delete params.failure;
    Ozone.util.Transport.send({
      url : url + uri + params.id,
      method: 'GET',
      onSuccess : success,
      onFailure : failure,
      autoSendVersion : false,
      content : params
    });
};