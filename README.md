# SCMS - depricated

Switching to an entirely static solution
github.com/samvictor/fcms


Sam's CMS. A Nodejs based CMS solution / Website builder (like wordpress) designed to work with Google's new firebase Hosting, Functions, and Database products. After extensive research, I've determined that this has not been done before, so I'm trying to do it myself.

# Instructions
Set up Firebase using the Firebase Cli.
Make sure to include **Functions** and **Hosting**.
Besides that, just choose that default options.

Put this repo in functions folder

Your folder structure should look something like this:

	home/
		- functions/
			- node_modules/
			- scms/
				- scms.js
				- init_settings.json  
				- serve/  
				- pug_templates/
			- index.js
			- package.json
		- public/
			- index.html  
		- database.rules.json
		- firebase.json

where "home" is just the root of your firebase directory.

Inside of the scms folder, there is a file called init_settings.json (home/functions/scms/init_settings.json). 
Copy "**init_settings.json**" and rename the copy to "**settings.json**". 
You don't have to open or edit it yet.


Next, make sure the following dependences are in home/functions/package.json:

	{
	  "name": "functions",
	  "description": "Cloud Functions for Firebase",
	  "dependencies": {
	    "firebase-admin": "5.1.0",
	    "firebase-functions": "0.6.1",
	    "pug": "2.0.0-rc.2",
	    "express": "4.15.3"
	  },
	  "private": true
	}



In home/funtions/index.js, do the following:

	scms = require('./scms/scms');
	exports.scms = functions.https.onRequest(scms.app);

If you want to install scms at the root of your domain (example.com/), then 
add the following rewrite to your home/firebase.json file:

	{
	  "source": "**", "function": "scms"
	}
	
It should look like this in context:

	{
	  "hosting": {
	    "public": "public",
	    
	    "rewrites": [      
	      {
	        "source": "**", "function": "scms"
	      }
	    ]
	  }
	}
Firebase automatically installs an "index.html" file for you. 
If you are installing scms to the root of your domain, you will need to delete this file.
Otherwise, this index.html file will take precedence over scms.


If you would like scms somewhere else on your domain (example.com/sub/),
add the following rewrites to home/firebase.json:

	{
	  "source": "/sub*", "function": "scms"
	},
	{
	  "source": "/sub*/**", "function": "scms"
	}

Again, in context, that looks like this:

	{
	  "hosting": {
	    "public": "public",
	    
	    "rewrites": [      
	      {
	        "source": "/sub*", "function": "scms"
	      },
	      {
	        "source": "/sub*/**", "function": "scms"
	      }
	    ]
	  }
	}

The important part is the rewrites that include "**scms**". The rest is just for context and can be
whatever you want it to be. 

Now install your dependances and deploy using command line/command prompt with

	cd functions
	npm install
	cd ..
	firebase deploy
	
Make sure you are in the "functions" directory (the directory with package.json) when you run "npm install", 
and in the "home" directory (the directory that contains the firebase.json file) when you run "firebase deploy".

Note: you only have to run npm install the first time. After that you can just do "firebase deploy". 
Actually, since we will only be working on "functions" from now on, you can just do "firebase deploy --only funtions" from now on.

Your website should now be live. Visit "/test_scms" under the url where scms is installed (either **example.com/test_scms** or **example.com/sub/test_scms**)
to make sure that it's working correctly.
If you haven't yet connected a custom domain to your firebase hosting, you can find the url where your website is hosted in
the print out after your deploy. It should look something like this:

	Deploy Complete!
	
	Project Console: https://console.firebase.google.com/project/projectname/overview
	Hosting URL: https://projectname.firebaseapp.com
	Function URL (scms): https://location-projectname.cloudfunctions.net/scms

In this case, you would go to **https://projectname.firebaseapp.com/test_scms** or **https://projectname.firebaseapp.com/sub/test_scms**.
If you've already closed the command console, you can always deploy again. It won't do anything except waste some of your time.

# Create Admin User (Settings File)

Now that scms is ready, we need to create an Administrator. 
Inside of the scms folder, there is a file called settings.json (home/functions/scms/settings.json). 
This file used to be called init_settings.json, but we changed the file name earlier. 
Open it.
By default it should look like this:

	{
		"ready": "no", 
		"email": "", 
		"password": "", 
		"root": "",
		"apiKey": "",
		"authDomain": "",
		"databaseURL": "",
		"projectId": "",
		"template_id": "0"
	}

* Choose a secure **email address** and **password** for the email and password fields.
If other people will likely see this settings file, don't worry, you can change
this email address and password later from the firebase console. 
You can also delete the password from this file after setup is complete.
If you get a message saying that a user with that email address already exists, 
change the email address in this file, deploy again, and try again.


* For **root**, enter the subdirectory of the scms installation with both leading and trailing slashes. **If you installed scms at the root of your website (example.com/)
then put a single slash for root ("root": "/")**

* For the **next few fields**, go to your firebase console and go to the "authentication" section
and click on "web setup". Copy the values you see there to the matching fields in the settings file.

Please note that scms does not check to make sure you've entered these correctly or entered them at all,
so make sure you get these right. It is also possible that the firebase team will change these fields over time,
so if you see something in the firebase console that does not match anything in the settings file, just leave it out.
Scms will probably work fine without it.

* Choose a **template id**. You can change this at any time. There are samples of each template and their ids on the test page. 
(**example.com/test_scms** or **example.com/sub/test_scms**). Make sure you surround the id with quotes.

* Once you are done with those, then set "**ready**" to "yes".

Here is an example of how it should look when you're done:


	{
		"ready": "yes", 
		"email": "myemail@gmail.com", 
		"password": "mypassword", 
		"root": "/sub/",
		"apiKey": "your-api-key",
		"authDomain": "example-id.firebaseapp.com",
		"databaseURL": "https://example-id.firebaseio.com",
		"projectId": "example-id",
		"template_id": "1"
	}

Notice that the root has both leading and trailing slashes. **These are important**. 
Again, if you installed scms at the root of your directory, a single slash is fine.

Even after setup is complete, you can still change the "ready" setting. 
In fact, the "ready" field is a security feature. Setting "ready" to "no" will disable all admin capability 
until you set it to "yes" again. 

Make sure you are in the "home" directory and deploy again with:

	firebase deploy

You can now visit "/setup" under the url where scms is installed (either **example.com/setup** or **example.com/sub/setup**) 
to continue your setup process. 

If you get the error: "Cannot GET /setup", this means that you did not set the "root" correctly in the settings file. 
Remember, if you would like scms to be installed at the root of the domain, set the "root" to a single slash "/" in the settings file.

After setup, go to the next section (Auth) to complete your setup.


## Auth
After setup, you should see a new user in the Authentication section of your firebase console.
This is the Admin user which is the only user that can edit pages, tabs, and site settings.

It will be created using the email and password that you provided in the settings file.
If you have any problems with this account, use the firebase console to fix them.
Don't come to me with you problems, just kidding.

You can also change the password at any time using the firebase console. 
Also, if you see that the Admin user has been created successfully in the firebase console, 
it is safe to remove your password from the settings.json file.

**Now you need to Enable Email/Password sign-in**:
1. In the Firebase console, open the "Authentication" section.
2. On the "Sign in method" tab, enable the Email/password sign-in method and click Save.

Later on, if you see an error that says that the signin method you are using has not been enabled, 
it is because you have not completed this step correctly.


## Database

Scms uses firebase's JSON-based database. Scms will use the path:

	'/scms_data/'

After setup, you should see some entries in your firebase database in that location. 
Please do not change any of these entries directly.

**Important: For security reasons, please follow the next few steps**

You need to change the firebase database rules:
1. Go to your firebase console
2. Go to the "Database" tab in your firebase console 
3. Click on the "Rules" tab.

The rules should look something like this:

	{
	  "rules": {
	    ".read": "auth != null",
	    ".write": "auth != null"
	  }
	}

You need set ".write" to false and allow only the admin user to write to /scms_data.
When you're done, it should look like this:

	{
	  "rules": {
	    ".read": "auth != null",
	    ".write": false,
	    "scms_data": {
	         ".write": "'admin_uid' === auth.uid",
	          ".read": true
	    }
	  }
	}


To get your admin_uid, go back to the "Authentication" section of your firebase console,
locate the admin user, and copy the User UID. 
Then go back to the firebase rules and paste that UID where it says "admin_uid".

Notice that the admin_uid must be surrounded by single quotes and everything after the colon 
must be surrounded by double quotes, and there are **3** equal signs in the "write" statement.

You can change this uid later if you need to change the admin user. 
Also, if you need more than one admin users, you can as many admin uids here as you'd like in the following way:

	".write": "'admin_uid_1' === auth.uid || 'admin_uid_2' === auth.uid || ..."

However, be careful. Any user in this list has the power to write to any page on the website.
Since we allow admin users to put javascript in their pages, this could lead to a cross site scripting attack.

This step will prevent write access to any other data you might have in your database, even if the user is authenticated.
To fix this, add specific rules for every other top-level path in the database like this:

	{
	  "rules": {
	    ".read": "auth != null",
	    ".write": false,
	    "scms_data": {
	        ".write": "'admin_uid' === auth.uid",
	        ".read": true
	    },
	    "path1": {
	        ".write": "auth != null"
	    },
	    "path2": {
	        ".write": "auth != null"
	    }
	  }
	}

Note: doing this for "path1" will also cover "path1/subpath". 
Also, you can set the global ".read" to be true or false and it won't affect scms,
however, setting the global ".write" to true or anything other than false will most likely destroy scms' security.


# Serving Static Files
## Such as images and PDFs

To serve static files, first store your file in 

	home/functions/scms/serve

then go to 

	example.com/scms_serve/filename.png
	or
	example.com/sub/scms_serve/filename.png
	
to get the file.



# Building Your Website

Now that your setup is complete, visit /scms_admin under your scms installation 
(**example.com/scms_admin** or **example.com/sub/scms_admin**) to build your website. 


# Extra Credit: Optimization

Scms uses firebase functions, which is currently much slower than firebase hosting (hopefully that changes in the future, making this section unnecessary). 
It is, however, simpler and more convenient for you, the webmaster. 
But, if you are willing to put in some extra work, we can get your website running even faster.

1. Go to the /scms_admin page
2. Click on 'Optimization'
3. Download the html files
4. Upload that file to firebase hosting (home/public)
5. Edit your rewrites to allow those files to be displayed (todo)
6. Add "cleanURLs": true to the firebase.json

Since scms uses a single template to show all of its content, this is the only file you have to worry about.
The admin page will still be slower, but the public facing pages will be fast.

Note: the optimized html file does have your config information, as does the un-optimized version, 
but it is safe to expose that information to the public. 
They are just the website urls for firebase's different services. 
They do not allow anyone to edit the data without your permission.

To further speed things up, you can add a caching header (todo)
to let the user's browser store the template for about a month.
Scms checks a database before showing its content, so the user will still see changes even if the changes aren't cached. 

Those steps will optimize the initial page load. To optimize images and other static content, do the following (todo):

1. Save your files in a directory named "scms_serve" under hosting (home/public)

Remember that we used rewrites to tell firebase to display our application. 
However, rewrites only work if there is nothing in that location in firebase hosting's "public" folder.
By putting a folder named "scms_serve" in firebase hosting, that folder will take precedence over our rewrite and be served instead of checking with scms

This is what the file structure should look like with your new scms folder and optimized file:

	home
		- functions/
			- node_modules/
			- scms/
				- scms.js
				- settings.json
				- serve/
				- pug_templates/
			- index.js
			- package.json
		- public/
			- index.html  <- optimized file
			- scms_admin.html  <- optimized file
			- scms_serve/ <- new serve folder
		- database.rules.json
		- firebase.json


And your firebase.json file should look like this if scms is installed under root:

    {
      "hosting": {
        "public": "public",
        "cleanUrls": true,
        
        "rewrites": [      
          {
            "source": "**", "destination": "/index.html"
          }
        ]
      }
    }


and like this if scms is installed under **example.com/sub**:

    {
      "hosting": {
        "public": "public"
        "cleanUrls": true,
        
        "rewrites": [      
          {
            "source": "/sub/*", "destination": "/sub/index.html"
          }
        ]
      }
    }




After these optimization steps, you will need to do "firebase deploy", 
not "firebase deploy --only functions" since these steps affect Firebase Hosting as well.

Note: after these steps, /scms_admin will not be case sensitive and will only work without a trailing slash.
"example.com/scms_Admin" and "example.com/scms_admin/" will not work. 

However, this is not the case with the rest of the website. So "example.com/Welcome" and "example.com/welcome/" will both display
"example.com/welcome".

