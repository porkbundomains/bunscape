const homepage='txttp://porkbun.institute';
const txttpregex =/^txttp:\/\/(.*?)(\/|$)/i;
const httpregex= /^https*/i;
var browserHistory=[];
var currentHistory=0; //the most recent place in the browser history is element 0


var getJSON = function(url, callback) {//we'll use this to execute the Google DNS API call
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};


var wiggle = function resetAnimation() {
  var twoTimesGif = document.getElementById("wiggle");
  twoTimesGif.src = twoTimesGif.src;
};


var loadTXTTP= function(myURL, manualVisit){ //use getJSON() to access the Google DNS API, then retrieve and decode a base64-encoded html file in a TXT record, then cram in into our inner iframe
	wiggle();
	if (myURL &&(found = myURL.match(txttpregex))){//extract the domain
			domain=(found[1]);
			domain = domain.toLowerCase();
		}
		
	if (manualVisit){ //the user typed it in or clicked, as opposed to a back/forward navigate

		browserHistory.splice(0, currentHistory); //remove any items in the history before our current spot
		browserHistory.unshift(myURL); //make a new element zero in the browser history
		currentHistory=0; //and now we're navigated all the way forward
	}
			

	getJSON('https://dns.google/resolve?name=txttp.' + domain + '&type=TXT', function(err, data) {
		
		  if (err !== null) {
			console.log('Cannot connect to Google DNS API for reason: ' + err);
			
		  }else if ("Answer" in data==false){
					var myError='<body bgcolor="white"><span style="font-size:2em;">Error: No TXT record found in DNS<br><br></span>';
					myError +='Searched for: txttp.' +domain +'<br>'+data.Comment + '<br>Authority: ' + data.Authority[0].data +'<br>TTL: ' + data.Authority[0].TTL;

					document.getElementById("innerframe").srcdoc=myError;
					document.getElementById("location").value=myURL;

		  
		  }else {//we got back good data
				//console.log(data);
				var prettyURL=data.Answer[0].data;

		
				fetch(prettyURL).then(function (response) {//This new fetch function can be used to force the browser's URL interpreter to parse a data URI, so that's what we're doing.
					// The API call was successful!
					return response.text();
				}).then(function (html) {
					// This is the HTML from our response as a text string. That's right, browsers can just do this nowadays!
					document.getElementById("innerframe").srcdoc=html;
					document.getElementById("location").value=myURL;
			
					setTimeout(function(){ //A terrible practice, but I couldn't figure out how to make it so the browser would wait until srcdoc was populated before running this function to mess with it. Maybe there's a secret callback I couldn't find? Anyway, this works, but don't ever do this kids, unless you've somehow convinced your manager to let you write a fake web browser.
						messUpInnerFrame(); 
						},500);

				}).catch(function (err) {
					// There was an error
					console.warn('Something went wrong.', err);
				});

	  }
	});
}


var clickHandler=function(element){
	event.preventDefault(); //clicking does nothing
	var clicked=element.target.href;
	if (clicked &&(found = clicked.match(txttpregex))){
		loadTXTTP(clicked, true);
	}
	if (clicked &&(clicked.match(httpregex))){
		alert("HTTP traffic is not permitted per the TXTTP specification");
	}

}

var messUpInnerFrame = function(){ //break all link normal behavior. Instead, place listeners to intercept links to browse to another txttp page
	document.getElementById("innerframe").contentWindow.document.removeEventListener("click", clickHandler);//if we don't do this, we risk double listeners which makes things even weirder
	document.getElementById("innerframe").contentWindow.document.addEventListener("click", clickHandler );
}

var backButton = function(){
	if (currentHistory<browserHistory.length -1){
		currentHistory++; //our active place in the history has now shifted back. Zero is the very frontmost navigation yet
		loadTXTTP(browserHistory[currentHistory],false);
	}
}

var forwardButton = function(){
	if (currentHistory>=1){
		currentHistory--; //our active place in the history has now shifted forward, but don't ever go further than zero
		loadTXTTP(browserHistory[currentHistory],false);
	}
}

var reloadButton = function(){
	loadTXTTP(browserHistory[currentHistory],false);
}

var homeButton = function(){
	loadTXTTP(homepage,true);
}

window.addEventListener('load', function () {//page loaded
	
	var node = document.getElementById("location"); //let's set up a listener to the URL bar
	node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
    	var typedURL=document.getElementById("location").value;
    	if (typedURL &&(typedURL.match(httpregex))){
				alert("HTTP traffic is not permitted per the TXTTP specification");
		}
		if (typedURL.match(httpregex)==null && typedURL.match(txttpregex)==null){//no protocol specified, probably
				typedURL='txttp://' + typedURL; //the user probably wanted to visit a TXTTP site since it's the preeminent new protocol all the kids are talking about
		}

		loadTXTTP(typedURL,true);		
    }
	});
	
loadTXTTP(homepage, true); //initial home page

})




