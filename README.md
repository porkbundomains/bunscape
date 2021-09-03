# Bunscape
Bunscape is a HTML browser (within your web browser) that uses DNS as a transport to retrieve web pages. Say goodbye to HTTPS, there’s a new kid on the block: TXTTP, aka HTML over DNS!

## What is TXTTP
TXTTP is a new protocol that stores and retrieves binary data as Data URIs within DNS itself using TXT records, with a max file size of roughly 25 kilobytes. Since HTML can be retrieved over TXTTP, and Google provides a free DNS-to-HTTP gateway service, Bunscape allows its users to view tiny web pages stored in TXT records and navigate from records stored on one domain to another. Web surfing without a web server!
    
## How to use

Live demo at https://porkbun.institute/bunscape

or, download the repo and open index.html, it should run fine locally in most modern web browsers.


## The browser
Bunscape is a sandboxed browser-within-your-browser written entirely in HTML, CSS, and javascript. We discovered that by creating a series of special nested `<iframe>` tags, we could create a controllable sandbox browser that disrupts the browser’s traditional URL retrieval mechanism and replaces it with a new page retriever that grabs HTML from base64-encoded data stored in TXT records. In our eyes, this TXT record retrieval method constitutes a new protocol: TXTTP.

  

## How TXTTP works
We’re too lazy to write an RFC, and the IETF probably wouldn’t endorse this project anyway, so here’s the gist: Bunscape browser does a TXT record DNS lookup for the domain to which it has been navigated. Each domain is allowed to serve one HTML page and one page only. Pages have to be small, shooting for around 25 kilobytes max after base64 encoding.

Once a HTML page has been authored, you can use the makesinglepage.js script to make all image assets inline. Once you’ve got a combined HTML file, you can then use txttp_save_porkbun.py in txttp-tools to encode the HTML file as a base64-encoded data URI that looks like this: 

	data:text/html;base64,PGgxPlBvcmtidW4gaXMgY29vbDwvaDE+

txttp_save_porkbun.py then saves it via the Porkbun DNS API as a TXT record on a given domain using this scheme:

  
    txttp.mydomain.tld

  
You can then retrieve the file from any computer connected to the Internet entirely over DNS using the txttp_get.py command. You can store a lot of cool things in under 25k of data, including images and sound files, but also HTML, which itself can contain base64-encoded binary assets via data URIs. Bunscape can surf from domain to domain, pulling TXT records filled with HTML and rendering them as a page.
  

## But why?!??!

We wanted to show that DNS is capable of more than people realize, and bring awareness to the fact that DNS is itself a data transport protocol; it’s just usually data your computer cares about more you do. The internet would break without DNS, despite remaining largely unchanged in its nearly 40 years of use. Sure, it’s optimized to transport small chunks of data, but sometimes a little data is all you need.

## Wait a second, browsers don't have the ability to directly query DNS records
Ok, you caught us. There is technically an HTTPS proxy sitting between Bunscape and the TXT records it craves: [Google's DNS-over HTTPS resolver](https://developers.google.com/speed/public-dns/docs/doh). This is a RESTful endpoint that Google provides for free to the world without restriction. It allows your browser to directly query any record type in DNS. So really, Bunscape is a HTML-over-DNS-over-HTTPS browser. Or, to put it another way, we've found a new use for Google DoH: a free CDN for under-25-kilobyte websites.