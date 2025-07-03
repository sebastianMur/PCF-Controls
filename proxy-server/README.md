The config/default.json file contains the json structure used to run the proxy.
You will need to replace clientid, secret, tenantid with an app registration for each target environment. 
You can add as many target environments to the json as needed.

To run proxy:
Open a new terminal
Execute the below command

node app -e curo365inquriesdev

The proxy uses -e parameter to find a property in the json with that name.
The terminal will show "starting proxy at localhost:3030"

You can now send any command to the target environment through localhost:3030

To see it working, open a browser and type in: http://localhost:3030/api/data/v9.0/accounts