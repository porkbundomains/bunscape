instructions =`
step 1: serve this folder off a web server, it won't work from the file system
step 2: put this at the top of the file to make inline: <script src="makesinglepage.js"></script>
step 3: load it in a browser and open the console. If you couldn't figure out step 2, you can just paste this entire file into the console
step 4: run makeAllInline() 
step 5: copyDOMtoString() and the webpage with all external assets now base64-encoded will appear on your clipboard. 
step 6: Paste into a text editor, remove the script tag added in step 2 if present, save as html
step 7: use txttp_save_porkbun.py to base64-encode the whole thing into a data URI and upload it into a TXT record
`;

console.log(instructions);



function toDataURL(url, callback) { //might be obsolete now
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

var makeAllInline = function(){ // run this first to convert everything into data URIs
	var anchors = window.document.getElementsByTagName("*");
	window.document.addEventListener("click", function(element){
		event.preventDefault();
	    console.log(element.target.href)
	});

	for (let i = 0; i < anchors.length; i++) {
		if (anchors[i].src){
			toDataURL(anchors[i].src, function(result){
				anchors[i].src=result
			});
		}		
	}
}

var copyDOMtoString= function(){ //run this next to copy it out
	(function (text) {
	  var node = document.createElement('textarea')
	  var selection = document.getSelection()

	  node.textContent = text
	  document.body.appendChild(node)

	  selection.removeAllRanges()
	  node.select()
	  document.execCommand('copy')

	  selection.removeAllRanges()
	  document.body.removeChild(node)
	})(document.documentElement.innerHTML)
}