import json
import requests
import re
import sys
import base64
import ntpath
import mimetypes

def getRecords(domain): #grab all the records so we know which ones to delete to make room for our record. Also checks to make sure we've got the right domain
	allRecords=json.loads(requests.post(apiConfig["endpoint"] + '/dns/retrieve/' + domain, data = json.dumps(apiConfig)).text)
	if allRecords["status"]=="ERROR":
		print('Error getting domain. Check to make sure you specified the correct domain, and that API access has been switched on for this domain.');
		sys.exit();
	return(allRecords)

def deleteRecord():
	for i in getRecords(rootDomain)["records"]:
		if (i["name"]==dataDomain) and (i["type"] == 'TXT'):
			print("Deleting existing " + i["type"] + " Record")
			deleteRecord = json.loads(requests.post(apiConfig["endpoint"] + '/dns/delete/' + rootDomain + '/' + i["id"], data = json.dumps(apiConfig)).text)

def createDataRecord():
	createObj=apiConfig.copy()
	createObj.update({'name': 'txttp', 'type': 'TXT', 'content': encoded, 'ttl': 300})
	endpoint = apiConfig["endpoint"] + '/dns/create/' + rootDomain
	print("Creating record: " + dataDomain)
	create = json.loads(requests.post(apiConfig["endpoint"] + '/dns/create/'+ rootDomain, data = json.dumps(createObj)).text)
	return(create)


if len(sys.argv)>3: #at least the config, root domain, and filename is specified
	apiConfig = json.load(open(sys.argv[1])) #load the config file into a variable
	rootDomain=sys.argv[2]
	baseFilename=ntpath.basename(sys.argv[3])		
	guessedMIME=mimetypes.guess_type(baseFilename, strict=False)[0]
	
	with open(sys.argv[3], "rb") as myfile:
		fileContent = myfile.read()
	
	encoded='data:' + guessedMIME + ';base64,' + base64.b64encode(fileContent).decode("ascii")
	dataDomain='txttp.' + rootDomain
	deleteRecord()
	print(createDataRecord()["status"])
	
else:
	print("txttp_save_porkbun.py: save binary data in TXT records using the Porkbun API (a Porkbun labs official terrible idea.)\n\nError: not enough arguments. Example:\npython3 txtfp_save_porkbun.py /path/to/config.json example.com filenametosave.png\n")