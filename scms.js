// Written by Sam for scms
// scms.js

const pug = require('pug');
const fs = require('fs');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase, 'scms');
const express = require('express');
const app  = express();
let settings = null;
let settings_found = false;
try {
    settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json'));
    settings_found = true;
}
catch (e) {
	settings_found = false;
	settings = {
		"ready": "no", 
		"email": "", 
		"password": "", 
		"root": "/",
		"apiKey": "",
	    "authDomain": "",
	    "databaseURL": "",
	    "projectId": "",
	    "template_id": ""
	};
}


// ========================================	SETUP ==================================
function setup(req, res) {
	
	if (settings['ready'] === 'no' || settings['password'] === '' || settings['email'] === ''
	      || settings['root'] === '' || settings['apiKey'] === '') {		
        return res.status(200).send('Settings File not set up yet.');
    }
    
    return admin.database().ref('/scms_data/general_info/setup_complete').once('value')
      .then(function(data) {
        if (data.val() === 'yes') {
            let message = 'Set up complete. Return to the setup instructions to finish setup, ';
            message += 'then visit <a href="'+settings['root']+'scms_admin">/scms_admin</a> to start working on your site';
            return res.status(200).send(pug.renderFile(__dirname + '/pug_templates/message.js', {'message': message}));
        }
        res.status(200).send(pug.renderFile(__dirname + '/pug_templates/setup.js'));
      });
}

function post_setup(req, res) {	
  // adding 2 second delay to prevent brute force attack
  return new Promise( function (resolve, reject) {
    setTimeout(function () {
      if (req.body.password !== settings['password']) {
          return res.status(200).send('thumbs down: Password Incorrect');
      }
      if (settings['ready'] === 'no') {
          return res.status(200).send('thumbs down: Ready is No');
      }
      if (req.body.site === '') {
          return res.status(200).send('thumbs down: Site Name cannot be left blank.');
      }
      
      let tabs = req.body['tabs'].split(';');
      let new_tabs = []
      let page_data = [];
      let page_info = [];
      
      // if no tabs, single page
      if (tabs.length === 1 && tabs[0] === '') {
      	page_data[0] = {'id': 0, 'name': 'Home', 'content': 'Single Page', 'url': ''};
      	page_info[0] = {'id': 0, 'name': 'Home', 'url': ''};
      	tabs = [];
  	  }
      else
	      tabs.forEach(function(tab, i){
	      	  if (tab === '')
	      	      return;
	      	  
	      	  tabs[i] = {'name': tab.trim(), 'id': i, 'url': tab.replace(/\W/g, '').toLowerCase(), 'type': 'page' }; 
	          new_tabs.push(tabs[i]);
	          page_data.push({'id': i, 'name': tabs[i]['name'], 'content': 'Nothing Here', 'url': tabs[i]['url']});
	          page_info.push(tabs[i]);
	      });
      tabs = new_tabs;
      
      let slideshow_images = req.body['slideshow_images'].split(';');
      
      if (slideshow_images.length === 0 || slideshow_images.length === 1 && slideshow_images[0] === '') {
          slideshow_images = [];
      }
      else
          slideshow_images.forEach(function(image, i){
              if (image === '')
                  return;
              
              slideshow_images[i] = image.trim();
          });
      
      admin.auth().createUser({
	    	email: settings['email'],
	   	 	password: settings['password'],
	  }).catch(function(error) {
		  // Handle Errors here.
		  // var error_code = error.code;
		  var error_message = error.message;
		  res.status(200).send('thumbs down:' + error_message);
		  reject(error_message);
	  }).then(function() {
        let to_db = {        	  
            'general_info': {
                'site_name': req.body['site'], 'site_color': req.body['color'],
                'setup_complete': 'yes', 'root': settings['root'],
                'site_tabs': tabs, 'page_info': page_info,
                'background_image': {'url': req.body['background_image']}, 'slideshow_images': slideshow_images,
                'header_image': {'url': req.body['header_image'], 'ratio': req.body['header_ratio']},
                'favicon_image': {'url': req.body['favicon']}
            },
            'info_page_content': {
                'site_name': req.body['site'], 'site_color': req.body['color'],
                'setup_complete': 'yes', 'root': settings['root'],
                'site_tabs': tabs, 'page_info': page_info,
                'background_image': {'url': req.body['background_image']}, 'slideshow_images': slideshow_images,
                'header_image': {'url': req.body['header_image'], 'ratio': req.body['header_ratio']},
                'favicon_image': {'url': req.body['favicon']}, 'page_content': page_data
            }
        }; 
        
        admin.database().ref('/scms_data/').set(to_db).then(function(){
	  	    res.status(200).send('thumbs up: Data Saved');
            resolve();
        }).catch(function(error){
        	res.status(200).send('thumbs down:' + error.message);
        	reject(error.message);
        });
	  });
      
    }.bind(req, res), 2000);     
  });
}

app.get(settings['root'] + 'setup', setup);
app.post(settings['root'] + 'setup', post_setup);


// ===================================================== ADMIN VIEW ===================================
app.get(settings['root'] + 'scms_admin', function(req, res) {
	if (settings['ready'] === 'no') {
        return res.status(200).send('Ready is No');
    }
    
	let to_admin = {'apiKey': settings['apiKey'], 'authDomain': settings['authDomain'],
						'databaseURL': settings['databaseURL'], 'projectId': settings['projectId'],
						'assignment': ''};
	
	res.status(200).send(pug.renderFile(__dirname + '/pug_templates/admin_home.js', to_admin));
});


app.get(settings['root'] + 'scms_admin/page/:id', function(req, res) {
	if (settings['ready'] === 'no') {
        return res.status(200).send('Ready is No');
    }
    
	let to_admin = {'apiKey': settings['apiKey'], 'authDomain': settings['authDomain'],
						'databaseURL': settings['databaseURL'], 'projectId': settings['projectId'],
						'assignment': 'page', 'assign_data': req.params.id};
	
	res.status(200).send(pug.renderFile(__dirname + '/pug_templates/admin_home.js', to_admin));
});


// ===================================================== CATCH ALLS ============================================
// catch all routes should be last to have lower precedence 

app.get(settings['root']+'scms_serve', function(req, res) {
    res.status(200).send(pug.renderFile('Use this location to serve static content, like images. But be careful, this publicly visible'));
});

app.get(settings['root']+'scms_serve/:file_name', function(req, res) {
    res.status(200).sendFile(__dirname + '/serve/'+req.params.file_name.replace(/\//g, ''));
});


// For regular users
app.get(settings['root'], function(req, res){
    res.status(200).send(pug.renderFile(__dirname + '/pug_templates/template_'+settings['template_id']+'.js', 
                                         {'page': '', 'apiKey': settings['apiKey'], 'authDomain': settings['authDomain'],
                                           'databaseURL': settings['databaseURL'], 'projectId': settings['projectId'],
                                           'root': settings['root']
                                         }));
});

app.get(settings['root']+':path', function(req, res){
    res.status(200).send(pug.renderFile(__dirname + '/pug_templates/template_'+settings['template_id']+'.js', 
                                        {'page': req.params.path, 'apiKey': settings['apiKey'], 'authDomain': settings['authDomain'],
                                           'databaseURL': settings['databaseURL'], 'projectId': settings['projectId'],
                                           'root': settings['root']
                                        }));
});


app.post(settings['root'], function(req, res) {
	// looking for site_title, page_title, and page_content, site_color
	admin.database().ref('/scms_data/info_page_content').once('value', function(snapshot){
		let data = snapshot.val();
		let for_res = {'site_title': data['site_name'], 'site_color': data['site_color'],
						'site_tabs': data['site_tabs'], 'background_image': data['background_image'],
						'slideshow_images': data['slideshow_images'], 'header_image': data['header_image'],
						'path': '', 'root': settings['root'], 'favicon_image': data['favicon_image']
		};
		
		let full_scms_base_url = 'https://' + req.get('host') + req.originalUrl;
		for_res['full_scms_base_url'] = full_scms_base_url;
		if(full_scms_base_url[ full_scms_base_url.length -1 ] !== '/')
		    for_res['full_scms_base_url'] += '/';
		
		data['page_content'].forEach(function(page, i){
			if (page['url'] === '') {
			    
				for_res['page_title'] = page['name'];
				for_res['page_content'] = page['content'];
				for_res['url'] = page['url'];
				
				console.log('and for_res is', for_res);
				res.status(200).send(JSON.stringify(for_res));
				
				return;
		    }
		});
		
		// if no page found matching the url, serve first tab
		// in the case of a single page, where there are no tabs,
		// that page's url should be root, so this situation should never happen.
		// but check for that situation anyway
	
		let page_id = 0;
		if (data['site_tabs'] !== [])
			page_id = data['site_tabs'][0]['id'];
			
		let page = data['page_content'][page_id];
		for_res['page_title'] = page['name'];
		for_res['page_content'] = page['content'];
		for_res['url'] = page['url'];
        res.status(200).send(JSON.stringify(for_res));
        return;
	});
});

app.post(settings['root']+':path', function(req, res) {
	// looking for site_title, page_title, and page_content
	admin.database().ref('/scms_data/info_page_content').once('value', function(snapshot){
		let data = snapshot.val();
		let for_res = {'site_title': data['site_name'], 'site_color': data['site_color'],
						'site_tabs': data['site_tabs'], 'background_image': data['background_image'],
						'slideshow_images': data['slideshow_images'], 'header_image': data['header_image'],
						'full_scms_base_url': 'https://' + req.get('host') + settings['root'],
						'root': settings['root'], 'favicon_image': data['favicon_image']
					  };
						
		let this_path = req.params.path.replace(/\W/g, '').toLowerCase();
		
        for_res['path'] = this_path;
		
		data['page_content'].forEach(function(page){
			if (page['url'] === this_path) {			  
			    
				for_res['page_title'] = page['name'];
				for_res['page_content'] = page['content'];
				for_res['url'] = page['url'];
				
				res.status(200).send(JSON.stringify(for_res));
				
				return;
		    }
		});
		
		for_res['page_title'] = "404";
        for_res['page_content'] = "Page Not Found";
		for_res['url'] = "404";
        res.status(200).send(JSON.stringify(for_res));
        return;
	});
	//req.params.path
});

app.get('/:extra*/test_scms', function (req, res) {
    if (settings_found === false) {
    	res.status(200).send('settings.json not found.');
    	return;
    }
    res.status(200).send('Hello World! So far so good. Template Samples. Ids can be: "0", "1", or "2"');
});

if (settings_found === false || settings['ready'] !== 'yes')
    app.get('/test_scms',  function (req, res) {
        if (settings_found === false) {
             res.status(200).send('settings.json not found.');
    	    return;
        } 
        res.status(200).send('Hello World! So far so good. Template Samples. Ids can be: "0", "1", or "2"')
    });


// =================================================== MODULE EXPORT ===================================

module.exports = {
	app: app
};

