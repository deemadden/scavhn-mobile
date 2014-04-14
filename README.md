Scavhn iOS App
==================

## Scavhn iOS App
Repo for the Scavhn Scavenger hunt app.  This relies on the scavhn-server project to run in a location accesible to your device or simulator to function correctly.  See the scavhn-server README.md for instructions on how to configure and run.

### Getting Started
In order for the Scavhn app to connect to the scahvn-server's REST api, the base path URL needs to be set in the web app portion of the project and the native container.  The base path format is

```
http://[ip for scavhn-server host]:3000/scavhn/v1/api
```

for the web app, set it on the servicesBaseURL key in the settings.js file located at Scavhn/web.  It can also be set using the ```update_ip_settings.sh``` file located at the root of this project.

For the native container, set the "REST Server URL" DefaultValue in Scavhn/Settings.bundle/Root.plist, located on line 35, to the base path for your currently running Scavhn instance.  

This is an NSUserSettings file, so you can also set it in Settings > Scavhn on your device or simulator at runtime.

### Scavhn App Settings
Under Settings > Scavhn on your device or simulator, you will see a couple of other options.  They are as follows:

**Disconnected Caching:** - When enabled, will front-load the Scavhn app from scavhn-server at launch with all of the data it needs to play a game, and store it in Core Data objects.  Additionally, the native container will handle all of the AJAX requests.

**Clear Cache On Launch** - Wipes any Core Data objects stored from a previous launch, before front-loading the data in the manner described above.  Should only be used in concert with the Disconnected Caching switch.