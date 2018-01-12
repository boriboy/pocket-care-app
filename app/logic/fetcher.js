export default class Fetcher {

  // sends post request to @uri with @data
  static post (url : string, data = {} ) {

    // init post config
    let postRequest = function (data) {
      return Object.assign(
        requestHeaders,
        postConfig,
        { body: JSON.stringify( Object.assign( data, {secret: apiKey})) }
    )}

    // submit request
    return this.fetch( serverApiUri + url, postRequest(data) )
  }

  // send get request to @uri with @data
  static get (url : string, data = {}) {

    // init post config
    let getRequest = function() {
      return Object.assign(
        requestHeaders,
        getConfig
      )}

    // submit request
    return this.fetch( serverApiUri + url + FetcherHelper.prepareQueryString(data), getRequest() )
  }

  /**
   * Delete http
   */
  static del (url : string) {
    // init post config
    let delRequest = function() {
      return Object.assign(
        requestHeaders,
        delConfig
      )}

    // submit request
    return this.fetch( serverApiUri + url , delRequest() )
  }

  static fetch (uri : string, config : object) {
    return fetch(uri, config).then(res => res.json())
  }

}

/**
 * helper class for fetcher api
 */
class FetcherHelper {

  static prepareQueryString (data : object) {
    let final = Object.assign(data, {secret: apiKey})
    return this.serialize(final)
  }

  static serialize( obj ) {
    return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
  }

}

const apiKey = 'b4lJH3bl3lF732azADV780Asg256bhg567'
const serverApiUri = 'https://pocket-care.herokuapp.com/api/'

const postConfig = {
  method: 'POST'
}

const getConfig = {
  method: 'GET',
  cache: 'default'
}

const delConfig = {
  method: 'DELETE'
}

const requestHeaders = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}
