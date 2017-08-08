// Written by Sam for scms
// setup.js
// This page should help complete the installation process
// Also, yes, this is a pug file. I just named it .js for the text coloring

doctype html
html(lang="en")
    head
        meta( charset="utf-8" )
        meta( http-equiv="X-UA-Compatible" content="IE=edge" )
        meta( name="viewport" content="width=device-width, initial-scale=1.0" )
        
        title SCMS Setup
        meta( name="theme-color" content="#bd2031" )
        
        script( src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" )
        
        link( rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous")
        script( src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous")
        
        
        style.
            h1, h2, h3, h4, h5, h6, t, p, body {
                font-family: sans-serif;
                text-align: center;
                color: #101010;
            }
            
            h4, h5 { color: #282828; }
            
            body { background-color: #f8f8f8; }
            
            .step_1{
            	padding-top: 200px;
            	font-weight: 100;
            }
            
            .step_2{
            	padding-top: 10px;
            	font-weight: 100;
            }
            
            #color_picker_display {
            	width: 60%;
            	height: 100px;
            	border: solid 1px #202020;
            	margin: 10px auto 5px auto;
            	background-color: #cb2031;
            }
            
            input, textarea {
            	color: black;
            	padding: 3px;
            	padding-left: 7px;
            	width: 60% !important;
            	margin-left: auto;
            	margin-right: auto;
            	text-align: center;
            }
            
            #tabs, #enter {
            	width: 60%;
            	margin: 3px auto 10px auto;
            }
            
            .alert {
              display: none;
              position: fixed;
              top: 15px;
              left: 50%;
              transform: translateX(-50%);
              width: 80%;
            }

    body
        h1(class="step_1") WELCOME
        div(class="step_2" style="display: none")
            
            h3 Choose Your Site Name 
            input(id="site_name" placeholder="Site Name" class="form-control")
            
            h3 Header Image Url
            h4 full path
            input(id="header_image" class="form-control" placeholder="https://example.com/header_img.png")
            
            h3 Header Image Ratio
            h4 to prevent page popping (image width/image height)
            input(id="header_ratio" placeholder="2.54019" type="number")
            
            h3 Favicon Url
            h4 full path
            input(id="favicon" class="form-control" placeholder="https://example.com/favicon_img.jpg")
            
            h3 Tabs 
            h4 (leave blank for no tabs, semicolon ";" separated)
            textarea(id="tabs" class="form-control") Home; News; Contact Us
            
            h3 Background Image
            h4 full path
            input(id="background_image" class="form-control" placeholder="https://example.com/background_image.png")
            
            h3 Slideshow Images
            h4 (semicolon ";" separated)
            textarea(id="slideshow_images" class="form-control" placeholder="https://example.com/image1.jpg; https://example.com/image2.jpg; https://example.com/image_3.png")
            
            h3 Choose Site Color 
            h4 (hex rbg, include the hash)
            input(id="site_color" value="#cb2031" class="form-control") 
            div(id="color_picker_display")
            
            h3 Enter Your Password
            input(id="password" type="password" class="form-control")
            br
            
            button(id="enter" class="btn btn-success")="Let's Go"
            br
        
        div( id="alert_success" class="alert alert-success" role="alert")
        div( id="alert_info" class="alert alert-info" role="alert")
        div( id="alert_warning" class="alert alert-warning" role="alert")
        div( id="alert_danger" class="alert alert-danger" role="alert")
            
            
    script. 
        $('.step_1').delay(500).animate({'padding-top': '20px'}, function(){ $('.step_2').fadeIn(); });
        
        $('#site_color').on('keyup', function () {
        	$('#color_picker_display').css('background-color', this.value);
        	console.log('changing color');
        });
        
        function submit() {
        	$('#alert_info').text('Working...').fadeIn().delay(1000).fadeOut();
          
          let to_post = { 'site': $('#site_name').val(), 'tabs': $('#tabs').val(),
        	                'color': $('#site_color').val(), 'password': $('#password').val(),
        	                'header_image': $('#header_image').val(), 'header_ratio': $('#header_ratio').val(),
        	                'favicon': $('#favicon').val(), 'background_image': $('#background_image').val(),
        	                'slideshow_images': $('#slideshow_images').val()};
        	
        	$.post( document.URL, to_post)
                .done(function( data ) {
                    data = data.split(':');
                    data[1] = data[1].trim();
                    if (data[0] === 'thumbs up') {
                      $('#alert_success').text(data[1]).fadeIn().delay(2400).fadeOut();
                      location.reload(true);
                    }
                    else {
                      $('#alert_danger').text(data[1]).fadeIn().delay(2400).fadeOut();                      
                    }
                });
        	
        }
        
        $('#enter').on('click', submit);
        $('#password').on('keypress', function(e){
        	if(e.which === 13) {
              submit();
          }
        });
        
        $('textarea').autoResize();
        
        
        
        
        
        