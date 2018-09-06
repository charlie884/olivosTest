(function (global) {
    var IniciarSesionViewModel,
        app = global.app = global.app || {};

    IniciarSesionViewModel = kendo.data.ObservableObject.extend({
        titulo:'Iniciar Sesión',
        cerrarSesion:function(){
            var usuario = window.localStorage.getItem('usuario');
            Pace.track(function(){
    			$.ajax({ 
    				url: app.servidor+'logout',
    				type: 'GET',
    				dataType: 'json',
                    data:{username:usuario}
    			})
    			.done(function(resp) {
    				if(resp === true){
                        window.localStorage.removeItem('usuario');
                        window.localStorage.removeItem('nombre');
                        window.localStorage.removeItem('email');
                        window.localStorage.removeItem('usuarioId');
                        app.application.navigate('#view-bienvenida');
                    }
    			});
    		});
        },
        iniciarSesion: function(){
            $('#formulario-bienvenida').submit(function(e){
                var username = $('#usuarioLogin').val();
                var password = $('#passwordLogin').val();
                console.log(username);
                console.log(password);
                //Pace.track(function(){
        			$.ajax({
        				url: app.servidor+'login',
        				type: 'GET',
        				dataType: 'json',
                        data:{username:username, password:password}
        			})
        			.done(function(resp) {
        				if(resp.id){
                            window.localStorage.setItem('usuario',resp.username);
                            window.localStorage.setItem('nombre',resp.name);
                            window.localStorage.setItem('email',resp.email);
                            window.localStorage.setItem('usuarioId',resp.id);
                            if(!window.localStorage.getItem('consecutivo')){
                                window.localStorage.setItem('consecutivo',0);
                            }
                            if(!window.localStorage.getItem('contratosGuardados')){
                                window.localStorage.setItem('contratosGuardados','0');
                            }
                            app.application.navigate('#view-contratos');
                        }else{
                            //app.mostrarMensaje("Error",resp.message,'error','Intentar de nuevo');
                            navigator.notification.alert('Error accediendo a la cuenta', function(){}, "Olivos", "Ok");
                            
                        }
        			});
        		//});
                e.preventDefault();
            });
        }
    });

    app.iniciarSesionService = {
        viewModel: new IniciarSesionViewModel()
    };
})(window);