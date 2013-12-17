
var iai = require( 'iai' )
  , Application = iai( 'core/Application' )
  , PublicLayout = {}
;

module.exports = Application(module)
  /*.privileges({
    get: 'view public layout'
  })
  .on('privilege required', function(){
    // Authenticate
  })
  .get(function(resource){
    PublicLayout.render();
  })
  .settings({

  })
  .settings( debug? {
  } : {})*/
  //.mount( 'users', iai( 'contrib/Users' ) )
  //.serve( UserInterface )
  //.listen( 3666 )
;
