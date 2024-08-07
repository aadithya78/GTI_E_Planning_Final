const os = require('os');
  function load(){ 
     try {
        console. log( "Computer Name:" , os. hostname());    
     }
     catch (e) {
       document.write('Permission to access computer name is denied' + '<br />');
     } 
  }
load();