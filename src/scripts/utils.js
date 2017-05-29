export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    try {
      return JSON.parse(decodeURIComponent(results[2].replace(/\+/g, " ")));
    } catch(e) {
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}
