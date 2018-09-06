(function (global) {
    var sincronizacionViewModel,
        app=global.app=global.app || {};
    
    sincronizacionViewModel = kendo.data.ObservableObject.extend({
        id:null,
        idEliminar:null,
        subirContrato:function(e){
            console.log('console e: '+e);
            var id=e.button[0].id;
            console.log(id);
            console.log('Subiendo: '+id);
            app.sincronizarService.viewModel.id = id;
            app.sincronizarService.viewModel.idEliminar = id;
            app.leerArchivo('contrato-'+id,app.sincronizarService.viewModel.subirContratante);
            
             
        },
        subirContratante:function(datos){
            var id = app.sincronizarService.viewModel.id;
            console.log(datos);            
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'datosContratante',
                    type:'GET',
                    dataType:'json',
                    data:datos
                    
                }).done(function(contrato){
                    console.log(contrato);
                    if(contrato){           
                        swal({
                          title: "Cargando...",
                          type: "warning",
                          buttons: false,
                          dangerMode: false,
                          showConfirmButton: false,
                        }); 
                        app.sincronizarService.viewModel.id=contrato;
                        app.leerArchivo('afiliado-'+id,app.sincronizarService.viewModel.subirAfiliado);
                        app.leerArchivo('beneficiario-'+id,app.sincronizarService.viewModel.subirBeneficiario);
                        app.leerArchivo('documentos-'+id,app.sincronizarService.viewModel.subirDocumentos);
                        app.leerArchivo('firmaAsesor-'+id,app.sincronizarService.viewModel.subirFirmaAsesor);
                        app.leerArchivo('valores-'+id,app.sincronizarService.viewModel.subirValores);
                        app.leerArchivo('firmaCliente-'+id,app.sincronizarService.viewModel.subirFirmaCliente);
                        app.eliminarArchivo('contrato-'+app.sincronizarService.viewModel.idEliminar);
                        window.localStorage.removeItem('contrato-'+app.sincronizarService.viewModel.idEliminar);
                        
                        setTimeout(function(){ 
                            $(".sweet-overlay, .sweet-alert").remove();
                            app.mostrarMensaje('','Sincronizado correctamente','success'); 
                            app.application.navigate('#view-contratos','fade'); 
                            var contratosGuardados = window.localStorage.getItem('contratosGuardados').split(',');
                            var encontrado = contratosGuardados.indexOf(app.sincronizarService.viewModel.idEliminar.toString());
                            contratosGuardados.splice(encontrado, 1);
                            window.localStorage.setItem('contratosGuardados', contratosGuardados.toString());
                            
                            Pace.track(function(){
                                $.ajax({
                                    url:app.servidor+'enviar_confirmacion',
                                    type:'GET',
                                    dataType:'json',
                                    data:{contrato:contrato}
                                }).done(function(correo){
                                    console.log('correo entrooo'+correo);
                                }).error(function(){ 
                                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                                });
                            });                            
                        }, 4000);
                        setTimeout(function(){ 
                            $("#overlay").fadeOut(); 
                        }, 4000);
                                                
                    }
                }).error(function(){
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                    setTimeout(function(){ $("#overlay").fadeOut(); }, 1000);
                });
                
            });
        },
        subirAfiliado:function(datos){
            datos.contrato = app.sincronizarService.viewModel.id;
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'agregar_afiliado',
                    type:'GET',
                    dataType:'json',
                    data:datos
                }).done(function(afiliado){
                    console.log(afiliado);
                    app.eliminarArchivo('afiliado-'+app.sincronizarService.viewModel.idEliminar);
                    window.localStorage.removeItem('afiliado-'+app.sincronizarService.viewModel.idEliminar);
                }).error(function(){ 
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                });
            });
        },
        subirBeneficiario:function(datos){
            $.each(datos,function(ix,vl){
                vl.contrato = app.sincronizarService.viewModel.id;
                Pace.track(function(){
                    $.ajax({
                        url:app.servidor+'agregar_beneficiario',
                        type:'GET',
                        dataType:'json',
                        data:vl
                    }).done(function(beneficiario){
                        console.log(beneficiario);
                    }).error(function(){ 
                        app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                    });
                });
            });

            app.eliminarArchivo('beneficiario-'+app.sincronizarService.viewModel.idEliminar);
            window.localStorage.removeItem('beneficiario-'+app.sincronizarService.viewModel.idEliminar);
        },
        subirFirmaAsesor:function(datos){
            datos.contrato = app.sincronizarService.viewModel.id;
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'convertirFirmaAsesor',
                    type:'POST',
                    dataType:'json',
                    data:datos
                }).done(function(firma){
                    console.log(firma);
                    app.eliminarArchivo('firmaAsesor-'+app.sincronizarService.viewModel.idEliminar);
                    window.localStorage.removeItem('firmaAsesor-'+app.sincronizarService.viewModel.idEliminar);
                }).error(function(){ 
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                });
            });
        },
        subirFirmaCliente:function(datos){
            datos.contrato = app.sincronizarService.viewModel.id;
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'convertirFirmaCliente',
                    type:'POST',
                    dataType:'json',
                    data:datos
                }).done(function(firma){
                    console.log(firma);
                    app.eliminarArchivo('firmaCliente-'+app.sincronizarService.viewModel.idEliminar);
                    window.localStorage.removeItem('firmaCliente-'+app.sincronizarService.viewModel.idEliminar);
                }).error(function(){ 
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                });
            });
        },
        subirDocumentos:function(datos){
            datos.contrato = app.sincronizarService.viewModel.id;
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'adjuntar_documentos',
                    type:'POST',
                    dataType:'json',
                    data:datos
                }).done(function(documentos){
                    console.log('documentos: '+documentos);
                    app.eliminarArchivo('documentos-'+app.sincronizarService.viewModel.idEliminar);
                    window.localStorage.removeItem('documentos-'+app.sincronizarService.viewModel.idEliminar);
                }).error(function(){ 
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                });
            });
        },
        subirValores:function(datos){
            datos.contrato = app.sincronizarService.viewModel.id;
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'agregar_valores',
                    type:'GET',
                    dataType:'json',
                    data:datos
                }).done(function(valores){
                    console.log(valores);
                    app.eliminarArchivo('valores-'+app.sincronizarService.viewModel.idEliminar);
                    window.localStorage.removeItem('valores-'+app.sincronizarService.viewModel.idEliminar);
                }).error(function(){ 
                    app.mostrarMensaje('Sin conexión','Recuerda que debes tener una conexión activa a Internet para sincronizar cada contrato.','error');
                });
            });
        }
        
    });
    
    app.sincronizarService={
      viewModel:new sincronizacionViewModel()  
    };
})(window);