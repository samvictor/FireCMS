// admin_home.js
// Written by Sam for scms
// This page is where admin users go to edit their pages
// Also, yes, this is a pug file. I just named it .js for the text coloring

doctype html
html(lang="en")
    head
        meta( charset="utf-8" )
        meta( http-equiv="X-UA-Compatible" content="IE=edge" )
        meta( name="viewport" content="width=device-width, initial-scale=1.0" )
        
        title SCMS Admin
        
        script( src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" )
        
        link( rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous")
        script( src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous")
        
        
        style.       
            body, html, #page_view {
              width: 100%;
              height: 99%;
            }
            body { background-color: #f8f8f8; }
            
            h1, h2, h3, h4, h5, h6, t, p, body {
                font-family: sans-serif;
                text-align: center;
                color: #101010;
            }
            
            h4, h5 { color: #282828; }
            
            #loading_div {
              width: 100%;
              height: 100%;
              position: fixed;
              top: 0px;
              left: 0px;
              text-align: center;
              padding-top: 100px;
              display: none;
              background-color: #202020;
            }
            #load_text {color: white;}
            
            .alert {
              display: none;
              position: fixed;
              top: 15px;
              left: 50%;
              transform: translateX(-50%);
              width: 80%;
            }
            
            #login {
              border: solid 1px #101010;
              border-radius: 2.5px;
              box-shadow: 3px 3px 9px #303030;
              background-color: white;
              width: 70%;
              margin: 100px auto 10px auto;
              padding: 5px;
              padding-bottom: 20px;
            }
            
            #login input { 
              width: 70%; 
              margin: 0px auto 10px auto;
              text-align: center;
            }
            
            #overview {
            	display: none;
            }
            
            .page_link {
            	cursor: pointer;
            }
            
            #settings_btn {
            	position: absolute;
            	top: 20px;
            	left: 20px;
            }
            
            #logout_btn {
            	position: absolute;
            	top: 20px;
            	right: 20px;
            }
            
            .logged_in{
            	/* these elements are visible iff you are logged in*/
            	display: none;
            }
            #page_view {
            	display: none;            	
            }
            
            #content_wrapper{
            	width: 100%;
            	height: 80%;
            	padding: 20px;
            }
            
            #content_editor {
            	width: 100%;
            	height: 100%;
            	padding: 10px;            	
            }

    body
        // slideshow images shouldn't be too wide (wider than 16:9)
        
        div( id="login" )
          h3 Login
          input( id="email" class="form-control"  placeholder="Email Address"  )
          input( id="password" class="form-control"  placeholder="Password" type="password" )
          button( id="enter" style="width: 100px;" class="btn btn-success" ) Enter
        
        div(id="overview")
          h1( class="site_name" )
          div( id="show_pages" )
          
        div(id="page_view")
          h4( class="site_name" )
          h3( id="page_name" )
          div( id="content_wrapper" )
            textarea( id="content_editor" )
          
          button( id='submit_page' class='btn btn-success') Submit
        
        
        button( id="settings_btn" class="btn btn-default logged_in" ) Settings
        button( id="logout_btn" class="btn btn-default logged_in" ) Logout
        
        
        div( id="loading_div" )
          h1( id="load_text" ) Loading
        
        
        div( id="alert_success" class="alert alert-success" role="alert")
        div( id="alert_info" class="alert alert-info" role="alert")
        div( id="alert_warning" class="alert alert-warning" role="alert")
        div( id="alert_danger" class="alert alert-danger" role="alert")
            
    
    script( src="https://www.gstatic.com/firebasejs/4.1.2/firebase.js" )
    script.
      // Initialize Firebase
      var config = {
        apiKey: "#{apiKey}",
        authDomain: "#{authDomain}",
        databaseURL: "#{databaseURL}",
        projectId: "#{projectId}"
      };
      firebase.initializeApp(config);
      
    script.
        function show_loading() {
        	  load_i++;
              switch (load_i % 4) {
                case 0:
                  load_text.text('Loading');
                  break;
                case 1:
                  load_text.text('Loading .');
                  break;
                case 2:
                  load_text.text('Loading . .');
                  break;
                case 3:
                  load_text.text('Loading . . .');
                  break;
              }
        }
        
       
        function load_loop () {
            if (!loading) return;
            show_loading();
            
            setTimeout(load_loop, 400);
        }
        
        var loading = false;
        var load_i = 0;
        var load_text = $('#load_text');
        //load_loop();
        
        $('#enter').on('click', get_data);
        $('#password').on('keypress', function(e){
            if(e.which === 13) {
                get_data();
            }
        });
        
        function get_data() {
            firebase.auth().signInWithEmailAndPassword($('#email').val(), $('#password').val()).catch(function(error) {
                // Handle Errors here.
                //var errorCode = error.code;
                var error_message = error.message;
                
                $('#alert_danger').text(error_message).fadeIn().delay(3000).fadeOut();
            });
            $('#email').val('');
            $('#password').val('');
            
        }
        
        let site_data = null;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                console.log('signed in');
                $('#loading_div').fadeIn();
                loading = true;
                load_loop();
                $('#login').fadeOut();
                $('.logged_in').fadeIn(80);
                
                firebase.database().ref('scms_data/general_info').once('value', function(snapshot) {
                    site_data = snapshot.val();
                    
                    try {
                        if(site_data['setup_complete'] !== 'yes') {
                            $('#alert_danger').text('Setup Not Complete. Go to /setup to finish setup').fadeIn();
                            $('#loading_div').fadeOut();
                            return;                            
                        }                            
                    }
                    catch (e) {
                        $('#alert_danger').text('Setup Not Complete. Go to /setup to finish setup').fadeIn();
                        $('#loading_div').fadeOut();
                        return;
                    }
                    
                    $('.site_name').text(site_data['site_name']);
                    
                    
                    if ('#{assignment}' !== '') {
                    	do_assignment('#{assignment}', '#{assign_data}');
                    	return;
                	}

                    $('#show_pages').text('');
                    let to_pages = '';
                    site_data['page_info'].forEach(function(page, i) {
                    	
                    	to_pages += '<a id="page_'+page['id']+'" page_id="'+page['id']+'" class="page_link" >';
                    	to_pages +=     page['name'];
                    	to_pages += '</a>';
                    	to_pages += '<br>';
                    
                    });
                    $('#show_pages').append(to_pages);
                    $('.page_link').on('click', function() {
                        do_assignment('page', $(this).attr('page_id'));
                    });
                    
                    $('#overview').fadeIn(80);
                    $('#loading_div').fadeOut();
                    loading = false;
                });
                
                
                // ...
            } else {
                // User is signed out.
                // ...
                console.log('signed out');
                curr_assignment = '';
                curr_assign_data = '';
                site_data = null;
                to_pages = '';
                
                $('#overview').fadeOut(function(){
                    $('#page_view').fadeOut(function(){
                        $('#login').fadeIn();                        
                	});
                });         
                
                $('.logged_in').fadeOut();
            }
        });
        
        var curr_assignment = '';
        var curr_assign_data = '';
        function do_assignment(assignment, assign_data) {
            curr_assign_data = assign_data;
            curr_assignment = assignment;
            
            if (assignment === 'page') {
            	let page_id = assign_data;
                console.log('doing page. assign data is ', assign_data);
                console.log('site data is ', site_data);
                
                $('#loading_div').fadeIn();
                loading = true;
                load_loop();
                $('#login').fadeOut();
                $('#overview').fadeOut();
                
                firebase.database().ref('scms_data/info_page_content/page_content/'+page_id).once('value', function(snapshot) {
                    let page_data = snapshot.val();
                    $('#page_name').text(page_data['name']);
                    $('#content_editor').text(page_data['content']);
                    
                    
                    $('#page_view').fadeIn();
                    $('#loading_div').fadeOut();
                    loading = false;
                });
            }
        }
        
        $('#submit_page').on('click', function(){
            firebase.database().ref('scms_data/info_page_content/page_content/'+curr_assign_data+'/content').set( $('#content_editor').val() )
                .then(function(){
        	        $('#alert_success').text('Data Saved').fadeIn().delay(1000).fadeOut();
                });
        });
        
        
        $('#logout_btn').on('click', function(){
            firebase.auth().signOut();
        });
        
        