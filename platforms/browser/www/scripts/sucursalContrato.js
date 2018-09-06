(function (global) {
    var sucursalContratoViewModel,
        app=global.app=global.app || {};
    
    sucursalContratoViewModel = kendo.data.ObservableObject.extend({
        sucursales:function(){
            var modelo = this; 
            $('#formSucursal').validetta({
                realTime: true,
                display : 'inline',
                errorTemplateClass : 'validetta-inline',
                onValid : function( event ) {
                    event.preventDefault();
                    app.application.navigate('#view-contratante','fade');
                }
            },{
                 required  : '*Campo Obligatorio'             
            }); 
            
            Pace.track(function(){
                $('#sucursales').html('');
                $('#tipoContrato').html('');
                $.ajax({
                    url:app.servidor+'get_sucursales',
                    type:'GET',
                    dataType:'json'
                })
                .done(function(sucursales){
                    app.guardarArchivo(sucursales,'cacheSucursales',null); 
                    app.sucursalContratoService.viewModel.render(sucursales);

                }).error(function(){ 
                    if(window.localStorage.getItem('cacheSucursales') === 'true'){
                        app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                        app.leerArchivo('cacheSucursales',app.sucursalContratoService.viewModel.render);
                    }else{
                        app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                    }
                    
                    
                });
           });
        },
        render:function(sucursales){
        console.log('Imprimiendo sucursales');
        console.log(sucursales);
            $.each(sucursales,function(index,valor){
                $("#sucursales").append('<option value="'+valor.id+'">'+valor.sucursal+'</option>');                   
            });
            $.ajax({
                    url:app.servidor+'tipo_contrato',
                    type:'GET',
                    dataType:'json'
            }).done(function(tipoContrato){
                console.log(tipoContrato);
                app.guardarArchivo(tipoContrato,'cacheTipoContrato',null); 
                app.sucursalContratoService.viewModel.renderTipoContrato(tipoContrato);
                
            }).error(function(){ 
                if(window.localStorage.getItem('cacheTipoContrato') === 'true'){
                    app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                    app.leerArchivo('cacheTipoContrato',app.sucursalContratoService.viewModel.renderTipoContrato);
                }else{
                    app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                }
            });
        },
        renderTipoContrato:function(tipoContrato){
            $.each(tipoContrato,function(idx,vlr){
                $("#tipoContrato").append('<option value="'+vlr.id+'">'+vlr.tipo_de_contrato+'</option>');
              
            });
            $("#tipoContrato").change(function(){
                var tipo = $(this).val();
                console.log(tipo)
                app.sucursalContratoService.viewModel.contenidoContrato(tipo);
                window.localStorage.setItem('idTipoContrato',tipo); 
            });
        },
        sucursalesSubmit:function(){
            $('#formSucursal').submit();
        },
        contenidoContrato: function(tipo){
            Pace.track(function(){
                $.ajax({
                    url: app.servidor+'consultar_tipo_contrato',
                    type: 'GET',
                    dataType: 'json',
                    data:{id:tipo}
                })
                .done(function(resp) {
                    console.log(resp);
                    window.localStorage.setItem('edadAfiliadoContrato',resp.edad_afiliado_principal);
                    window.localStorage.setItem('edadBeneficiarioContrato',resp.edad_beneficiario);
                    window.localStorage.setItem('edadAdicionalContrato',resp.edad_adicional);
                    app.guardarArchivo(resp,'cacheContenidoContrato'+tipo,null); 
                    app.sucursalContratoService.viewModel.renderContenidoContrato(resp);
                 }).error(function(){ 
                    if(window.localStorage.getItem('cacheContenidoContrato'+tipo) === 'true'){
                        app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                        app.leerArchivo('cacheContenidoContrato'+tipo,app.sucursalContratoService.viewModel.renderContenidoContrato);
                    }else{
                        app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                    }
                });
            });
        },
        renderContenidoContrato:function(resp){
            $('#textoClausula').html(resp.clausula);
            $('#tituloClausula').html(resp.tipo_de_contrato);
            window.localStorage.setItem('codigoTipoContrato',resp.codigo);
        }
        
    });
    
    app.sucursalContratoService={
        viewModel:new sucursalContratoViewModel()  
    };
})(window);