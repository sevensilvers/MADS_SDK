# MADS SDK

MobileAds Custom Ad SDK, you can create your own creative ad and plug it into our MobileAds container to serve ou to any of our certified inventories.

## Directory Structure

You are to follow exactly on how the structure should be.

![MADS Structure](http://i.imgur.com/cyhEs0x.png?1)

## Index.html

The following is how the index.html looks and is not allowed to alter, keep it as how it was.
Even adding js file, font file or css file is not allowed. 

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>CustomAd</title>
        <script>
            var custTracker = function () {
            // This function is anonymous, is executed immediately and 
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
            } else {
            query_string[pair[0]].push(pair[1]);
            }
            } 
            return JSON.parse(decodeURIComponent(query_string.custTracker));
            } ();
        </script>
    </head>
    <body>
        <div id="rma-widget">

        </div>
    </body>
        <script src="js/main.js"></script>
    </html>


## Main.js

Main.js contains all our SDK method, and you should do your coding in main.js . If you are allowed to code in a separate js file, but you will have to import that js file in main.js too.

### Usage

First current your own function or object, and initialize our SDK

    var myApp = function () {
        //initialize MADS SDK
        var sdk = new mads();
    }
    
Variables 

    /* HTML Body Tag */
    sdk.bodyTag;
    
    /* HTML Head Tag */
    sdk.headTag;

    /* Url path to project, used when you are accessing local files */
    sdk.path;
    
    /* #rma-widget div tag, content container */
    sdk.contentTag;
    
To load Js file, with an optional callback function allowed 

    sdk.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', function () {
        /* callback */
    });
    
    /* Load local js */ 
    sdk.loadJs( sdk.path + 'js/script.js');
    
To load Css file
    
    sdk.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
    
    /* Load local css */
    sdk.loadCss( sdk.path + 'css/style.css'); 
    
To load your content 

    sdk.contentTag.innerHTML = 
        '<div class="container"><div class="jumbotron"> \
            <h1>Hello, world!</h1> \
            <p>...</p> \
            <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p> \
        </div></div>';
        
To open any links, please use our SDK. Do not use html href or or javascript window.open

    sdk.linkOpener('http://www.mobileads.com');
    
Tracker. We will be triggering the same value tracker for only once. So if you ever need to track same value tracker in different places, please put in a unique name for each of them too. 

    sdk.tracker('value');
    
    /* With optional name */
    sdk.tracker('value', 'name'); 
    
Initialize myApp

    new myApp();


