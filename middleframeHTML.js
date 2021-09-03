/*
ok, so you may be wondering why we have to do it this way. The reason is the srcdoc
property of iframes. Normally a document can't manipulate a child iframe unless they have
the same origin. Nested iframes with data URs as the src don't have the same origin.
If you assign an iframe a src of a data URI, it's immediately in a sandbox and can't be
manipulated. But there is a loophole, which seems to exist on every browser: srcdoc.
If you have a plain-text representation of some HTML (what we see below), you can assign
that into an iframe's srcdoc property and assuming its parent is also an iframe to which
the same was done, the two can interact, they share an origin (somehow). That's why we make
the HTML into a variable rather than just using the src property of the iframe.
There's probably another origin trick for making this work, but this one worked when I
tried it, so I'm sticking with it.
*/

middleFrameHTML = `
<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head></head>
<body>
<script src="middleframe.js"></script>

<div class="row">
 <div class="column" style="">
	  <button onclick="homeButton()" class="button"><div class="labels"><span style="font-size:20px">⌂</span><br>Home</div></button>
</div> <div class="column" style="">
	<button onclick="backButton()" class="button"><div class="labels"><span style="font-size:30px">↫</span><br>Back</div></button>
</div> <div class="column" style="">
	<button onclick="forwardButton()" class="button"><div class="labels"><span style="font-size:30px">↬</span><br>Forward</div></button>
</div> <div class="column" style="">
	<button onclick="reloadButton()" class="button"><div class="labels"><span style="font-size:21px">⟳</span><br>Reload</div></button>
</div> <div class="column" style="float:right; width:70px">
  <span id="pb-wiggle"><img id= "wiggle" src="wiggle.gif" style="image-rendering: pixelated; image-rendering: crisp-edges;"></span>
</div></div>

<div class="row" style="padding-top:10px">
	<span class="column" style="font-family: 'WinThreeOne'; font-size:13px;">Location: </span>
	<span class="column" style="width:70vw;"><input style="font-family: 'WinThreeOne'; font-size:13px; width:60vw;" type="text" id="location" name="location"></span>
	<br><br>
</div>
<iframe id="innerframe" style="border:1; margin:0; width:100%; height:70vh; background-color:#C0C0C0;"></iframe>
<!-- the above 70vh is a crude hack because I have no idea how to make this actually properly fill the rest of the box -->


<style>

@font-face {
    font-family: 'WinThreeOne';
    src: url('fonts/w95fa.woff2') format('woff2'),
         url('fonts/w95fa.woff') format('woff');
}


body {
  background-color: #C0C0C0;
}

.wrap {
  display: flex;
  align-items: left;
  justify-content: left;
}

.labels {
  display: inline-block;
}

.column {
 box-sizing: border-box;
  float: left;
  padding: 10px;
}

.row:after {

  display: table;
  clear: both;
}


.button {
  width: 56px;
  height: 56px;
  font-family: 'WinThreeOne', sans-serif;
  font-size: 13px;
  color: #000;
  background-color: #C0C0C0;
  border: none;
  box-shadow: inset -2px -2px 2px #000000, inset 2px 2px 2px #DDDDDD;
  cursor: pointer;
  outline: none;
  line-height:20px;
  padding:1px;
  margin:0px;

}
.button:active{
	 box-shadow: inset 2px 2px 2px #777777;
	 color: #999;
}
.button:active .labels{
	 transform: translate(2px, 2px);
}



/*buttons */
.column {
  float: left;
  width: 58px;
  padding: 0px;

}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}



</style>
</body></html>
`;



document.getElementById("middleframe").srcdoc=middleFrameHTML;
