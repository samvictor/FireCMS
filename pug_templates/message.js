// Written by Sam for scms
// Use this page to show simple messages
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
            body {
              width: 100%;
              min-height: 100%;
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
              text-align: center;
              padding-top: 40px;
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
        h1 !{message}
        
        div( id="alert_success" class="alert alert-success" role="alert")
        div( id="alert_info" class="alert alert-info" role="alert")
        div( id="alert_warning" class="alert alert-warning" role="alert")
        div( id="alert_danger" class="alert alert-danger" role="alert")
            
            
    script. 
        
        
        
        
