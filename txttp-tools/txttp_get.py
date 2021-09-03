import json
import requests
import re
import sys
import base64
import dns.resolver
import mimetypes

if len(sys.argv)>1: #at least the domain is specified
	rootDomain=sys.argv[1]
	if len(sys.argv)>2:
		pathToSave=sys.argv[2]
	else:
		pathToSave = '.'
	dataDomain='txttp.' + rootDomain


	try:
		rawRecord=dns.resolver.resolve(dataDomain,"TXT").response.answer
	except:
		print("Could not resolve " + dataDomain)
		sys.exit()
	TXTrecord=str(rawRecord[0][0])
	TXTrecord = re.sub('"', '', TXTrecord) #these two lines join the sequential TXT records
	TXTrecord = re.sub(' ', '', TXTrecord)

	
	match = re.search(r'data:(.+\/.+);base64,(.*)$', TXTrecord)
	mimetype=(match.group(1))
	b64data=(match.group(2))
	guessedExtension=mimetypes.guess_extension(mimetype, strict=False)
	finalFilename=rootDomain + guessedExtension
	finalBinary=base64.b64decode(b64data)

	try:
		with open(pathToSave + '/' + finalFilename, "wb") as myfile:
			print ("writing " + pathToSave + '/' +finalFilename)
			myfile.write(finalBinary)
	except:
		print("couldn't write file.")
else:
	print("txttp_get.py get binary data from TXT records (a Porkbun labs official terrible idea.)\n\nError: not enough arguments.\n\nSyntax:\npython3 txttp_get.py example.com /path/to/saveto\n(saves to local folder if second argument omitted)\n\nExamples:\npython3 txttp_get.py myamazingdomain.fake ./safefolder\npython3 txttp_get.py myamazingdomain.fake")