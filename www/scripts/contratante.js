(function (global) {
    var contratanteViewModel,
        app=global.app=global.app || {};
    
    contratanteViewModel = kendo.data.ObservableObject.extend({
        mostrar:function(e){
            e.view.scroller.scrollTo(0, 0);
            $(".parentescoList").html('');
            $(".ciudadList").html('');
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'parentesco',
                    type:'GET', 
                    dataType:'json'
                })
                .done(function(parentesco){
                    app.guardarArchivo(parentesco,'cacheParentesco',null); 
                    app.contratanteService.viewModel.renderParentesco(parentesco);
                    
                }).error(function(){ 
                    if(window.localStorage.getItem('cacheParentesco') === 'true'){
                        app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                        app.leerArchivo('cacheParentesco',app.contratanteService.viewModel.renderParentesco);
                    }else{
                        app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                    }
                });
            });
            
        },
        renderParentesco:function(parentesco){
            $.each(parentesco,function(index,valor){
                $(".parentescoList").append('<option value="'+valor.codigo+'">'+valor.parentesco+'</option>');                   
            });
            
            $.ajax({
                url:app.servidor+'get_sucursales',
                type:'GET', 
                dataType:'json' 
            }).done(function(ciudad){
                app.guardarArchivo(ciudad,'cacheCiudad',null); 
                app.contratanteService.viewModel.renderCiudad(ciudad);
                  
            }).error(function(){ 
                if(window.localStorage.getItem('cacheCiudad') === 'true'){
                    app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                    app.leerArchivo('cacheCiudad',app.contratanteService.viewModel.renderCiudad);
                }else{
                    app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                }
            });
        },
        renderCiudad:function(ciudad){
            $.each(ciudad,function(index,valor){
                $(".ciudadList").append('<option value="'+valor.id+'">'+valor.sucursal+'</option>');                     
            });  
        },
        mostrarEdad:function(e){
            e.view.scroller.scrollTo(0, 0);
             $.ajax({
                url:app.servidor+'parentesco',
                type:'GET',
                dataType:'json'
            })
            .done(function(parentesco){
                $(".parentescoList").html('');
                $.each(parentesco,function(index,valor){
                    $(".parentescoList").append('<option value="'+valor.codigo+'">'+valor.parentesco+'</option>');                   
                });
              
            }).error(function(){ 
                if(window.localStorage.getItem('cacheParentesco') === 'true'){
                    app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');
                    app.leerArchivo('cacheParentesco',app.contratanteService.viewModel.renderParentescoB);
                }else{
                    app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                }
            });
            $.datetimepicker.setLocale('es');
            $("#fechaNacimientoBen").datetimepicker({
                maxDate: new Date(),
                timepicker:false,
                format:'Y-m-d',
                mask:true,
                onSelectDate:function(fecha){
                    var today = new Date();
                    var birthDate = new Date(fecha);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    var minima = window.localStorage.getItem('edadBeneficiarioContrato').split('-')[0];
                    var maxima = window.localStorage.getItem('edadBeneficiarioContrato').split('-')[1];
                    console.log("Edad Restringida, los beneficiarios debe ser de mínimo "+minima+' años y máximo '+maxima+' años');
                    /*if (age < parseInt(minima) || age > parseInt(maxima)){
                        navigator.notification.alert("Edad Restringida, los beneficiarios debe ser de mínimo "+minima+' años y máximo '+maxima+' años');
                        $("#fechaAfi").val(""); 
                    }else{
                        
                    }*/
                }
            });
        },
        
        renderParentescoB:function(parentesco){
           
            $(".parentescoList").html('');
            $.each(parentesco,function(index,valor){
                $(".parentescoList").append('<option value="'+valor.codigo+'">'+valor.parentesco+'</option>');                   
            });
        },
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
                        //window.localStorage.removeItem('usuario');
                        //window.localStorage.removeItem('nombre');
                        //window.localStorage.removeItem('email');
                        //window.localStorage.removeItem('usuarioId');
                        window.localStorage.clear();
                        app.application.navigate('#view-bienvenida');
                    }
                });
            });
        },
        esconderContratos: function(){
            $('#contListadoContratos').html('');
            
        },
        esconderContratosGuardados: function(){
            $('#contListadoContratosGuardados').html('');
            
        },
        tiposContrato:null,
        descargarInfo:function(){
            
        },
        consultarContratosGuardados:function(){
            if (window.localStorage.getItem('contratosGuardados') != null ) {
                app.contratanteService.viewModel.guardados = []; 
                var guardados = window.localStorage.getItem('contratosGuardados').split(',');
                console.log(guardados);
                $('#contListadoContratosGuardados').html('<ul class="afiliados" id="listadoContratosGuardados"></ul>');
                $.each(guardados,function(ix,vl){
                   //console.log('Valor vl: '+vl);
                   if(vl != 0){
                       //console.log(vl);
                       app.leerArchivo('contrato-'+vl,app.contratanteService.viewModel.renderGuardados);
                   } 
                });
            }
        },
        guardados:[],
        renderGuardados:function(contrato){
            console.log('Recibido contrato: ');
            console.log(contrato);
            app.contratanteService.viewModel.guardados.push(contrato);
            var objContratos = app.contratanteService.viewModel.guardados;
            console.log(objContratos);
            var guardados = window.localStorage.getItem('contratosGuardados').split(',');
            console.log(objContratos.length+' - '+(guardados.length-1));
            if(objContratos.length === (guardados.length-1)){
                app.contratanteService.viewModel.renderListadoGuardados(objContratos);
            }
        },
        renderListadoGuardados:function(contratos){
            console.log('Dibujando listado');
            console.log(contratos);
            $("#listadoContratosGuardados").kendoMobileListView({
                dataSource: contratos,
                template: $('#template_contratos_guardados').html(),
                /*filterable: {
                    placeholder:'Buscar aqui...',
                    field:'numeroDocumento',
                    operator:'contains'
                }*/
            });
        },
        consultarContratos:function(){
            var modelo = this;
            
            $.ajax({
                url:app.servidor+'tipo_contrato',
                type:'GET',
                dataType:'json'
            }).done(function(tipoContrato){
                console.log('Tipos de contrato:');
                console.log(tipoContrato);
                modelo.tiposContrato = [];
                $.each(tipoContrato,function(ic,vl){
                    modelo.tiposContrato[parseInt(vl.id)]=vl.tipo_de_contrato;
                });
                $('#contListadoContratos').html('<ul class="afiliados" id="listadoContratos"></ul>');
                console.log('Consultando contratos');
                var datos = {};
                datos.asesor = window.localStorage.getItem('usuarioId');
                
                Pace.track(function(){
                    $.ajax({
                        url:app.servidor+'consultar_contratos',
                        type:'GET',
                        dataType:'json',
                        data:datos
                        
                    }).done(function(contratos){
                        $('#no-internet').fadeOut();
                        console.log(contratos.length);
                        console.log('Contratos:');
                        console.log(contratos);
                        if(contratos.length === 0){
                            $('#no-contratos').fadeIn();
                        }else{
                            $('#no-contratos').fadeOut();
                            console.log('Tipos de contrato, en función de contratos');
                            console.log(modelo.tiposContrato);
                            console.log(contratos);
                            $.each(contratos,function(ix,vl){
                                var tipo = parseInt(vl.tipo_de_contrato);
                                console.log(tipo);
                                vl.tipo_de_contrato = modelo.tiposContrato[tipo];
                            })
                            $("#listadoContratos").kendoMobileListView({
                                dataSource: contratos,
                                template: $('#template_contratos').html(),
                                filterable: {
                                    placeholder:'Buscar aqui...',
                                    field:'numero_de_documento',
                                    operator:'contains'
                                }
                            });
                        }
                        
                        
                    });
                });
            }).error(function(){
                $('#no-internet').fadeIn();
            });
            
            
        },
        ActualizarContratoCon:false,
        iniciarContratante:function(){
            console.log(app.contratanteService.viewModel.ActualizarContratoCon+'este');
            $('#formContrato').validetta({
                realTime: true,
                display : 'inline',
                errorTemplateClass : 'validetta-inline',
                onValid : function( event ) {
                    event.preventDefault();
                    var datos = {};
                    datos.tipoDocumento=$('#tipoDocumento').val();
                    datos.numeroDocumento=$('#numeroDocumento').val();
                    datos.nombre=$('#nombre').val();
                    datos.telefono=$('#telefono').val();
                    datos.direccion=$('#direccion').val();
                    datos.ciudad=$('#ciudad').val();
                    datos.correo=$('#email').val();
                    datos.parentesco=$('#afiParentesco').val();
                    datos.sucursal=$('#sucursales').val();
                    datos.tipo_de_contrato=$('#tipoContrato').val();                    
                    datos.asesor = window.localStorage.getItem('usuarioId');
                    if (app.contratanteService.viewModel.ActualizarContratoCon==false){                        
                         Pace.track(function(){
                            $.ajax({
                                url:app.servidor+'datosContratante',
                                type:'GET',
                                dataType:'json',
                                data:datos
                                
                            }).done(function(contrato){
                                app.guardarArchivo(contrato,'cacheContrato'+contrato,null);
                                app.contratanteService.viewModel.renderContrato(contrato);
                            }).error(function(){ 
                                var consecutivo = parseInt(window.localStorage.getItem('consecutivo'))+1;
                                datos.consecutivo = consecutivo;
                                app.guardarArchivo(datos,'contrato-'+consecutivo,null);
                                window.localStorage.setItem('contratoActual',consecutivo);
                                window.localStorage.setItem('consecutivo',consecutivo);
                                app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                                app.contratanteService.viewModel.renderContrato(consecutivo);
                            });
                            
                        });                        
                    }else{
                        datos.id=window.localStorage.getItem('idContrato');
                         Pace.track(function(){
                            $.ajax({
                                url:app.servidor+'editar_datos_contratante',
                                type:'GET',
                                dataType:'json',
                                data:datos
                                
                            }).done(function(contrato){
                                app.contratanteService.viewModel.ActualizarContratoCon=true;
                                console.log(contrato);
                                if(contrato){
                                    window.localStorage.setItem('idContrato',contrato);
                                    app.application.navigate('#view-afiliado','fade');                                    
                                }
                                  
                            }).error(function(){ 
                                var consecutivo = parseInt(window.localStorage.getItem('consecutivo'))+1;
                                datos.consecutivo = consecutivo;
                                app.guardarArchivo(datos,'contrato-'+consecutivo,null);
                                window.localStorage.setItem('contratoActual',consecutivo);
                                window.localStorage.setItem('consecutivo',consecutivo);
                                app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                                app.contratanteService.viewModel.renderContrato(consecutivo);
                            });
                            
                        });       
                       console.log(app.contratanteService.viewModel.ActualizarContratoCon+'estePositivo');
                    }
                }
            },{
                 required  : '*Campo Obligatorio'             
            }); 
        },
        renderContrato:function(contrato){
            app.contratanteService.viewModel.ActualizarContratoCon=true;
            console.log('Contrato creado, respuesta server:');
            console.log(contrato);
            if(contrato){
                window.localStorage.setItem('idContrato',contrato);                          
                app.application.navigate('#view-afiliado','fade');
                
            }
        },
        agregar:function(){
            $('#formContrato').submit();
        },
        actualizarContrato:false,
        iniciarAfiliado:function(){
            console.log(app.contratanteService.viewModel.actualizarContrato+'este');
             $.datetimepicker.setLocale('es');                         
             $('#formAfiliado').validetta({
                realTime: true,
                display : 'inline',
                errorTemplateClass : 'validetta-inline',
                onValid : function( event ) {
                    console.log('En submit validate');
                    event.preventDefault();
                    var datos = {};
                    datos.tipo_documento=$('#tipoDocAfi').val();
                    datos.documento=$('#documentoAfi').val();
                    datos.sexo=$('#sexoAfi').val();
                    datos.nombres=$('#nombresAfi').val();
                    datos.correo_electronico=$('#correoAfi').val();
                    datos.telefono=$('#telefonoAfi').val();
                    datos.direccion=$('#direccionAfi').val();
                    datos.ciudad=$('#ciudadAfi').val();
                    datos.fecha_nacimiento=$('#fechaAfi').val();
                    datos.estado_civil=$('#estadoAfi').val();
                    datos.ocupacion=$('#ocupacionAfi').val();
                    datos.contrato = window.localStorage.getItem('idContrato');
                     
                    if(app.contratanteService.viewModel.actualizarContrato==false){                 
                        Pace.track(function(){
                            $.ajax({
                                url:app.servidor+'agregar_afiliado',
                                type:'GET',
                                dataType:'json',
                                data:datos
                                
                            }).done(function(afiliado){
                                app.guardarArchivo(afiliado,'cacheAfiliado'+afiliado,null);
                                app.contratanteService.viewModel.renderAfiliado(afiliado);
                                
                                
                            }).error(function(){ 
                                var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                                app.guardarArchivo(datos,'afiliado-'+consecutivo,null);
                                app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                                app.contratanteService.viewModel.renderAfiliado(true);
                            });
                        });
                    }else{
                        Pace.track(function(){
                            $.ajax({
                                url:app.servidor+'editar_afiliado',
                                type:'GET',
                                dataType:'json',
                                data:datos
                                
                            }).done(function(afiliado){
                                console.log(afiliado);
                                if(afiliado===true){              
                                    app.application.navigate('#view-beneficiarios','fade');
                                }
                                
                            }).error(function(){ 
                                console.log('cool');
                                var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                                app.guardarArchivo(datos,'afiliado-'+consecutivo,null);
                                app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                                app.contratanteService.viewModel.renderAfiliado(true);
                            });
                        });
                        console.log( app.contratanteService.viewModel.actualizarContrato);
                    }//Fin else
    }
             },{
                 required  : '*Campo Obligatorio'
             });
                 
        },
        renderAfiliado:function(afiliado){
            console.log(afiliado);
            if(afiliado===true){              
                
                app.contratanteService.viewModel.actualizarContrato=true;
                app.application.navigate('#view-beneficiarios','fade');
            }
        },
        agregarAfiliado:function(){
             $('#formAfiliado').submit();          
            //alert('OK');
        },
        afiliadosContador:function(){
               
        },
        consultarBeneficiarios:function(){
            var datos = {};
            datos.contrato = window.localStorage.getItem('idContrato');
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'consultar_beneficiarios',
                    type:'GET',
                    dataType:'json',
                    data:datos
                    
                }).done(function(beneficiarios){
                    console.log(beneficiarios);
                    window.localStorage.setItem('beneficiariosActuales',beneficiarios.length);
                    console.log(window.localStorage.getItem('codigoTipoContrato'));
                    if(beneficiarios.length === 0){
                        $('#no-beneficiarios').fadeIn();
                    }else{
                        $('#no-beneficiarios').fadeOut();
                        $('#contenedorBeneficiarios').html('<ul id="listadoBeneficiarios"></ul>');
                        $("#listadoBeneficiarios").kendoMobileListView({
                            dataSource: beneficiarios,
                            template: $('#template_beneficiarios').html(), 
                        });
                        
                        
                        console.log('B:: '+window.localStorage.getItem('beneficiariosActuales'));
                        if(parseInt(window.localStorage.getItem('beneficiariosActuales'))<6){
                            //$('#agregarUsuario').fadeIn();
                            $("#tipoBen option[value='1']").show();
                        }else{
                            $("#tipoBen option[value='1']").hide();
                            //$('#agregarUsuario').fadeOut();
                        }
                    }
                    
               }).error(function(){ 
                        var consecutivo = parseInt(window.localStorage.getItem('contratoActual')); 
                    if(window.localStorage.getItem('cacheBeneficiario'+consecutivo) === 'true'){
                        app.mostrarMensaje('Sin conexión','No tienes conexión, se trabajará con datos almacenados anteriormente','warning');                       
                        app.leerArchivo('beneficiario-'+consecutivo,app.contratanteService.viewModel.renderBeneficiarios);
                    }else{
                        $('#no-beneficiarios').fadeIn();
                        app.mostrarMensaje('Sin conexión','No tienes conexión y no hay datos almacenados anteriormente','error');
                    }
                });
            });
        },
        
        renderBeneficiarios:function(beneficiarios){
            window.localStorage.setItem('beneficiariosActuales',beneficiarios.length);
            $('#no-beneficiarios').fadeOut();
            $('#contenedorBeneficiarios').html('<ul id="listadoBeneficiarios"></ul>');
            $("#listadoBeneficiarios").kendoMobileListView({
                dataSource: beneficiarios,
                template: $('#template_beneficiarios').html(), 
            });
            console.log('BL:: '+window.localStorage.getItem('beneficiariosActuales'));
            if(parseInt(window.localStorage.getItem('beneficiariosActuales'))<6){
                //$('#agregarUsuario').fadeIn();
                $("#tipoBen option[value='1']").show();
            }else{
                $("#tipoBen option[value='1']").hide();
                //$('#agregarUsuario').fadeOut();
            }
        },
        onChange:function(){
           var switchInstance = $("#switchDatos").data("kendoMobileSwitch");           
           console.log(switchInstance.check());
           if(switchInstance.check()==true){
               $('#documentoAfi').val($('#numeroDocumento').val());
               $('#correoAfi').val($('#email').val());
               $('#nombresAfi').val($('#nombre').val());
               $('#telefonoAfi').val($('#telefono').val());
               $('#direccionAfi').val($('#direccion').val());
               $('#ciudadAfi').val($('#ciudad').val());
               $('#tipoDocAfi').val($('#tipoDocumento').val());
           }else{
               $('#documentoAfi').val('');
               $('#correoAfi').val('');
               $('#nombresAfi').val('');
               $('#telefonoAfi').val('');
               $('#direccionAfi').val('');
               $('#tipoDocAfi').val('');
               $('#ciudadAfi').val('');
           }
           
        },
        beneficiarioNuevo:null,
        iniciarBeneficiario:function(){
             $('#formBeneficiario').validetta({
                realTime: true,
                display : 'inline',
                errorTemplateClass : 'validetta-inline',
                onValid : function( event ) {
                    event.preventDefault();
                    var datos = {};                    
                    datos.documento=$('#documentoBen').val();
                    datos.primer_apellido=$('#primerApellidoBen').val();
                    datos.segundo_apellido=$('#segundoApellidoBen').val();
                    datos.nombres=$('#nombresBen').val();
                    datos.fecha_nacimiento=$('#fechaNacimientoBen').val();
                    datos.codParentesco=$('#parentescoBen').val();
                    datos.contrato = window.localStorage.getItem('idContrato');
                    //datos.tipo = window.localStorage.getItem('tipoBen');
                    datos.tipo = $('#tipoBen').val();
                    Pace.track(function(){
                        $.ajax({
                            url:app.servidor+'agregar_beneficiario',
                            type:'GET',
                            dataType:'json',
                            data:datos
                            
                        }).done(function(beneficiario){
                            console.log(datos);
                            if(beneficiario){
                                app.application.navigate('#view-beneficiarios','fade');
                                $('#documentoBen').val("");
                                $('#primerApellidoBen').val("");
                                $('#segundoApellidoBen').val("");
                                $('#nombresBen').val("");
                                $('#fechaNacimientoBen').val("");
                                $('#parentescoBen').val("");                              
                                $('#tipoBen').val("2");
                            }
                            
                        }).error(function(){ 
                            var consecutivo = parseInt(window.localStorage.getItem('consecutivo'));
                            datos.consecutivo = consecutivo;
                            datos.parentesco = {};
                            datos.parentesco.parentesco = $("#parentescoBen option[value='"+datos.codParentesco+"']").text();
                            console.log(window.localStorage.getItem('cacheBeneficiario'+consecutivo));
                            //window.localStorage.setItem('cacheBeneficiario'+consecutivo,false);
                            if (window.localStorage.getItem('cacheBeneficiario'+consecutivo)=='true') {  
                                app.contratanteService.viewModel.beneficiarioNuevo = datos;
                                app.leerArchivo('beneficiario-'+consecutivo,app.contratanteService.viewModel.renderBeneficiariosArray);
                                
                            }else{
                                          
                                swal({
                                  title: "Cargando...",
                                  type: "warning",
                                  buttons: false,
                                  dangerMode: false,
                                  showConfirmButton: false,
                                });
                                var info = [];
                                info.push(datos);
                                app.guardarArchivo(info,'beneficiario-'+consecutivo,null);
                                
                                setTimeout(function(){ 
                                    window.localStorage.setItem('cacheBeneficiario'+consecutivo,true);
                                    app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                                    app.contratanteService.viewModel.renderBeneficiario(true);
                                },4000);
                            }
                        });
                   });
                }    
            },{
                 required  : '*Campo Obligatorio'
            });      
       
        },
        
        renderBeneficiariosArray:function(beneficiarios){
            var consecutivo = parseInt(window.localStorage.getItem('consecutivo'));
            beneficiarios.push(app.contratanteService.viewModel.beneficiarioNuevo);
            console.log(beneficiarios);
            console.log(app.contratanteService.viewModel.beneficiarioNuevo);
            app.guardarArchivo(beneficiarios,'beneficiario-'+consecutivo,'');
            // swal({
            //   title: "Cargando...",
            //   type: "warning",
            //   buttons: false,
            //   dangerMode: false,
            //   showConfirmButton: false,
            // });
            setTimeout(function(){ 
                window.localStorage.setItem('cacheBeneficiario'+consecutivo,true);
                app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                app.contratanteService.viewModel.renderBeneficiario(true);
            },4000);
        },
        renderBeneficiario:function(afiliado){
            console.log(afiliado);
            if(afiliado===true){              
                // $(".sweet-overlay, .sweet-alert").remove();
                app.contratanteService.viewModel.actualizarContrato=true;
                app.application.navigate('#view-beneficiarios','fade');
                $('#documentoBen').val("");
                $('#primerApellidoBen').val("");
                $('#segundoApellidoBen').val("");
                $('#nombresBen').val("");
                $('#fechaNacimientoBen').val("");
                $('#parentescoBen').val("");                              
                $('#tipoBen').val("2");
            }
        },
        agregarBeneficiario:function(){
             $('#formBeneficiario').submit();             
            console.log($('#parentescoBen').val());
            swal({
              title: "Cargando...",
              type: "warning",
              buttons: false,
              dangerMode: false,
              showConfirmButton: false,
            });
            setTimeout(function(){                 
                $(".sweet-overlay, .sweet-alert").remove();
            },4000);
        },
        initValores: function(){
            $('.precio').priceFormat({
                prefix: '$ ',
                centsSeparator: ',',
                thousandsSeparator: '.',
                centsLimit: 0
            });
            var cuota = 0;
            // var adicional = 0;
            // jQuery('#adicionalVlr').val(0);
            $('#cuotaVlr').change(function() {
                cuota = parseInt($(this).val());
                adicional = parseInt($('#adicionalVlr').val());
                $('#total_cuotaVlr').val(cuota+adicional);
            });
            $('#adicionalVlr').change(function() {
                cuota = parseInt($('#cuotaVlr').val());
                adicional = parseInt($(this).val());
                $('#total_cuotaVlr').val(cuota+adicional);
            });
            $('#modalidadVlr').change(function(){
                var valorAdicional = jQuery('#adicionalVlr').val();
                console.log('add: '+valorAdicional);
                if (valorAdicional == '') {
                    var valorAdicional = 0;
                }else{
                    var valorAdicional = parseInt($('#adicionalVlr').unmask());
                }
                var modalidad = jQuery(this).val();
                var valorCuota = parseInt($('#cuotaVlr').unmask());
                // var valorAdicional = parseInt($('#adicionalVlr').unmask());
                console.log('adicional: '+valorAdicional);
                if(modalidad === 'Mensual'){
                    console.log('cuota: '+valorCuota);
                    console.log('cuota: '+valorAdicional);
                    $('#total_cuotaVlr').val( (valorCuota+valorAdicional) * 1 );
                }else if(modalidad === 'Trimestral'){
                    console.log('cuota: '+valorCuota);
                    console.log('cuota: '+valorAdicional);
                    $('#total_cuotaVlr').val( (valorCuota+valorAdicional) * 3 );
                }else if(modalidad === 'Semestral'){
                    console.log('cuota: '+valorCuota);
                    console.log('cuota: '+valorAdicional);
                    $('#total_cuotaVlr').val( (valorCuota+valorAdicional) * 6 );
                }else if(modalidad === 'Anual'){
                    console.log('cuota: '+valorCuota);
                    console.log('cuota: '+valorAdicional);
                    $('#total_cuotaVlr').val( (valorCuota+valorAdicional) * 12 );
                }
                $('#total_cuotaVlr').priceFormat({
                    prefix: '$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.',
                    centsLimit: 0
                });
            });
        },
        agregarValores:function(){
            var datos = {};
            datos.cuota=$('#cuotaVlr').val();
            datos.adicional=$('#adicionalVlr').val();
            datos.total_cuota=$('#total_cuotaVlr').val();
            datos.modalidad_de_pago=$('#modalidadVlr').val();
            datos.observaciones=$('#observacionesVlr').val();
            datos.contrato = window.localStorage.getItem('idContrato');
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'agregar_valores',
                    type:'GET',
                    dataType:'json',
                    data:datos
                    
                }).done(function(valores){
                    
                    console.log(valores);
                    app.guardarArchivo(valores,'cacheValores'+valores,null);
                    app.contratanteService.viewModel.renderValores(valores);
                    
                    
                }).error(function(){ 
                    var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                    app.guardarArchivo(datos,'valores-'+consecutivo,null);
                    app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                    app.contratanteService.viewModel.renderValores(true);
                });
           });
        },
        renderValores:function(valores){
            if(valores){
                app.application.navigate('#view-firma-asesor','fade');
                $('#cuotaVlr').val("");
                $('#adicionalVlr').val("");
                $('#total_cuotaVlr').val("");
                $('#modalidadVlr').val("");
                $('#observacionesVlr').val("");
            }
        },
        //firmaAsesor : null,
        //firmaCliente : null,
        initFirmaAsesor: function(){
            $("#firma").html('');
            $("#firma").jSignature();
        },
        initFirmaCliente: function(){
            $("#firmaC").html('');
            $("#firmaC").jSignature();
        },
        guardarFirmaAsesor: function(){
            var firmaAsesor =  $("#firma").jSignature("getData");
            console.log(firmaAsesor);
            console.log($("#firma").jSignature('getData','base30')[1].length);
            if( $("#firma").jSignature('getData','base30')[1].length == 0) {
                 navigator.notification.alert("Falta la firma del Asesor");
            }else{
                Pace.track(function(){
                    var datos = {};
                    datos.firma = firmaAsesor;
                    datos.contrato=window.localStorage.getItem('idContrato');
                    $.ajax({
                        url:app.servidor+'convertirFirmaAsesor',
                        type:'POST',
                        dataType:'json',
                        data:datos

                    }).done(function(firma){
                        console.log(firma);
                        if(firma !== false){
                            $("#firma").html('');
                            app.application.navigate('#view-firma-cliente','fade');
                        }

                    }).error(function(){
                        var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                        app.guardarArchivo(datos,'firmaAsesor-'+consecutivo,null);
                        app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                        app.application.navigate('#view-firma-cliente','fade');
                        $("#firma").html('');
                    });
                });

            }
        },
        guardarFirmaCliente: function(){
            var firmaCliente =  $("#firmaC").jSignature("getData");
            console.log(firmaCliente);
            
            if( $("#firmaC").jSignature('getData','base30')[1].length == 0) {
                navigator.notification.alert("Falta la Firma del Cliente");
            }else{
                Pace.track(function(){
                    var datos = {};
                    datos.firma = firmaCliente;
                    datos.contrato=window.localStorage.getItem('idContrato');
                    $.ajax({
                        url:app.servidor+'convertirFirmaCliente',
                        type:'POST',
                        dataType:'json',
                        data:datos
                        
                    }).done(function(firma){
                        console.log(firma);
                        if(firma !== false){
                            $("#firmaC").html('');
                            app.application.navigate('#view-adjuntar-documentos','fade');
                        }
                        
                    }).error(function(){ 
                        var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                        app.guardarArchivo(datos,'firmaCliente-'+consecutivo,null);
                        app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                        app.application.navigate('#view-adjuntar-documentos','fade');
                        $("#firmaC").empty();
                    });
                });
                
            }
            
        },
        iniciarDocumentos: function(){
            $('.adjuntar li').click(function(){
                var id=$(this).children('img').attr('id');
                console.log('Documento '+id);
                navigator.notification.confirm(
                    'Selecciona', // message
                     function(boton){
                         if(boton === 1){
                             navigator.camera.getPicture(onSuccess, onFail, { 
                                quality: 20,
                                destinationType: Camera.DestinationType.DATA_URL
                            });

                            function onSuccess(imageData) {
                                //alert('Cambiando');
                                var image = document.getElementById(id);
                                var nuevoSrc = "data:image/jpeg;base64," + imageData;
                                image.src = nuevoSrc;
                                
                                
                            } 

                            function onFail(message) { 
                                //navigator.notification.alert(message, function(){}, "Colombian Coffee Hub", "Ok");
                            }
                         }else if(boton === 2) {
                                navigator.camera.getPicture(listoFoto, onFail, { 
                                    quality: 40,
                                    destinationType: Camera.DestinationType.DATA_URL,
                                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                    allowEdit : true,
                                    targetWidth: 400,
                                  targetHeight: 400
                                });
                                
                                function listoFoto(imageData) {
                                    //alert('Cambiando');
                                    var image = document.getElementById(id);
                                    var nuevoSrc = "data:image/jpeg;base64," + imageData;
                                    image.src = nuevoSrc;
                                    
                                    
                                }

                                function onFail(message) {
                                    //navigator.notification.alert(message, function(){}, "Colombian Coffee Hub", "Ok");
                                }
                         }else if(boton === 3) {
                                return;
                         }
                         
                     },            // callback to invoke with index of button pressed
                    'Documento',           // title
                    ['Usar cámara','Elegir imagen', 'Cancelar']         // buttonLabels
                );
            })
        },
        adjuntarDocumentos:function(){
            var datos = {};
            datos.doc1 = $('#1').attr('src');
            datos.doc2 = $('#2').attr('src');
            datos.doc3 = $('#3').attr('src');
            datos.doc4 = $('#4').attr('src');
            datos.doc5 = $('#5').attr('src');
            datos.doc6 = $('#6').attr('src');
            datos.doc7 = $('#7').attr('src');
            datos.doc8 = $('#8').attr('src');
            datos.doc9 = $('#9').attr('src');
            datos.doc10 = $('#10').attr('src');
            datos.doc11 = $('#11').attr('src');
            datos.doc12 = $('#12').attr('src');
            datos.contrato=window.localStorage.getItem('idContrato')
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'adjuntar_documentos',
                    type:'POST',
                    dataType:'json',
                    data:datos
                }).done(function(docs){
                    console.log(docs);
                    if(docs){
                        $('#1').attr('src','images/adjuntar.png');
                        $('#2').attr('src','images/adjuntar.png');
                        $('#3').attr('src','images/adjuntar.png');
                        $('#4').attr('src','images/adjuntar.png');
                        $('#5').attr('src','images/adjuntar.png');
                        $('#6').attr('src','images/adjuntar.png');
                        $('#7').attr('src','images/adjuntar.png');
                        $('#8').attr('src','images/adjuntar.png');
                        $('#9').attr('src','images/adjuntar.png');
                        $('#10').attr('src','images/adjuntar.png');
                        $('#11').attr('src','images/adjuntar.png');
                        $('#12').attr('src','images/adjuntar.png');
                        $('#contenedorBeneficiarios').html('');
                        var switchInstance = $("#switchDatos").data("kendoMobileSwitch");
                        switchInstance.check(false);
                        $('#agregarUsuario').fadeIn();
                        app.application.navigate('#view-finalizado','fade');
                    }
                    
                }).error(function(){ 
                    var consecutivo = parseInt(window.localStorage.getItem('contratoActual'));
                    app.guardarArchivo(datos,'documentos-'+consecutivo,null);
                    app.mostrarMensaje('Sin conexión','Se guardará el contrato en el dispositivo. Recuerda sincronizarlo.','error');
                    //$('#contenedorBeneficiarios').html('');
                    //var switchInstance = $("#switchDatos").data("kendoMobileSwitch");
                    //switchInstance.check(false);
                    //$('#agregarUsuario').fadeIn();
                    app.application.navigate('#view-finalizado','fade');
                    $('#1').attr('src','images/adjuntar.png');
                    $('#2').attr('src','images/adjuntar.png');
                    $('#3').attr('src','images/adjuntar.png');
                    $('#4').attr('src','images/adjuntar.png');
                    $('#5').attr('src','images/adjuntar.png');
                    $('#6').attr('src','images/adjuntar.png');
                    $('#7').attr('src','images/adjuntar.png');
                    $('#8').attr('src','images/adjuntar.png');
                    $('#9').attr('src','images/adjuntar.png');
                    $('#10').attr('src','images/adjuntar.png');
                    $('#11').attr('src','images/adjuntar.png');
                    $('#12').attr('src','images/adjuntar.png');
                });
            });
            
        },       
        mostrarId:function(e){
            e.view.scroller.scrollTo(0, 0);
            
           var switchInstance = $("#switchDatos").data("kendoMobileSwitch");        
           if(switchInstance.check()==true){
              switchInstance.toggle();
           }
            console.log(window.localStorage.getItem('idTipoContrato'));
            $("#fechaAfi").datetimepicker({
                maxDate: new Date(),
                timepicker:false,
                format:'Y-m-d',
                mask:true,
                onSelectDate:function(fecha){
                    var today = new Date();
                    var birthDate = new Date(fecha);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    var minima = window.localStorage.getItem('edadAfiliadoContrato').split('-')[0];
                    var maxima = window.localStorage.getItem('edadAfiliadoContrato').split('-')[1];
                    /*if (age < parseInt(minima) || age > parseInt(maxima)){
                        navigator.notification.alert("Edad Restringida, el afiliado principal debe ser de mínimo "+minima+' años y máximo '+maxima+' años');
                        $("#fechaAfi").val(""); 
                    }else{
                        
                    }*/
                }
            });
        },
        consultarValores:function(){
             console.log(window.localStorage.getItem('idTipoContrato'));
            var tarifa = 'tarifa-'+window.localStorage.getItem('idTipoContrato');
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'consultar_edad',
                    type:'GET',
                    dataType:'json',
                    data:{contrato:window.localStorage.getItem('idTipoContrato')}            
                }).done(function(resp){
                    $('#cuotaVlr').val(resp.tarifa);   
                    $('#total_cuotaVlr').priceFormat({
                        prefix: '$ ',
                        centsSeparator: ',',
                        thousandsSeparator: '.',
                        centsLimit: 0
                    }); 
                    $('#cuotaVlr').priceFormat({
                        prefix: '$ ',
                        centsSeparator: ',',
                        thousandsSeparator: '.',
                        centsLimit: 0
                    });
                    app.guardarArchivo(resp,'tarifa-'+window.localStorage.getItem('idTipoContrato'),null);
                    window.localStorage.setItem(tarifa,true);
                }).error(function(){
                    //console.log(window.localStorage);
                    if (window.localStorage.getItem(tarifa)=='true') {
                        console.log(tarifa);
                        app.leerArchivo(tarifa,app.contratanteService.viewModel.renderTarifa);
                    }else{
                        app.mostrarMensaje('Sin conexión','Deberás poner los datos manualmente. Recuerda sincronizarlo.','error');
                    }                    
                });
            });
        },
        renderTarifa:function(tarifa){
            console.log(tarifa);
            $('#cuotaVlr').val(tarifa.tarifa);   
            $('#view-valores .precio').priceFormat({
                prefix: '$ ',
                centsSeparator: ',',
                thousandsSeparator: '.',
                centsLimit: 0
            });
        },
        enviarCorreo:function(){
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'enviar_confirmacion',
                    type:'GET',
                    dataType:'json',
                    data:{contrato:window.localStorage.getItem('idContrato')}            
                }).done(function(resp){                    
                    console.log(resp);
                    if(resp){
                        console.log('destruye firmaAsesor');
                        $("#firma").html('');
                        $("#firmaC").html('');
                        $('#tipoDocumento').val("");
                        $('#numeroDocumento').val("");
                        $('#nombre').val("");
                        $('#telefono').val("");
                        $('#direccion').val("");
                        $('#ciudad').val("");
                        $('#email').val("");
                        $('#parentesco').val("");
                        $('#sucursales').val("");
                        $('#tipoContrato').val("");                                
                        $('#sucursales').val("");
                        $('#tipoContrato').val("");
                        $('#tipoDocAfi').val("");
                        $('#documentoAfi').val("");
                        $('#sexoAfi').val("");
                        $('#nombresAfi').val("");
                        $('#correoAfi').val("");
                        $('#telefonoAfi').val("");
                        $('#direccionAfi').val("");
                        $('#ciudadAfi').val("");
                        $('#fechaAfi').val("");
                        $('#estadoAfi').val("");
                        $('#ocupacionAfi').val("");
                        app.application.navigate('#view-contratos','fade');
                        app.contratanteService.viewModel.ActualizarContratoCon=false;
                        app.contratanteService.viewModel.actualizarContrato=false;
                    }                                        
                }).error(function(){ 
                    console.log('jdjd');
                    var guardados = window.localStorage.getItem('contratosGuardados').split(',');
                    guardados.push(parseInt(window.localStorage.getItem('contratoActual')));
                    window.localStorage.setItem('contratosGuardados',guardados);
                    window.localStorage.setItem('contratoActual',null);
                    $('#contenedorBeneficiarios').html('');
                    $("#firma").html('');
                    $("#firmaC").html('');
                    $('#tipoDocumento').val("");
                    $('#numeroDocumento').val("");
                    $('#nombre').val("");
                    $('#telefono').val("");
                    $('#direccion').val("");
                    $('#ciudad').val("");
                    $('#email').val("");
                    $('#parentesco').val("");
                    $('#sucursales').val("");
                    $('#tipoContrato').val("");                                
                    $('#sucursales').val("");
                    $('#tipoContrato').val("");
                    $('#tipoDocAfi').val("");
                    $('#documentoAfi').val("");
                    $('#sexoAfi').val("");
                    $('#nombresAfi').val("");
                    $('#correoAfi').val("");
                    $('#telefonoAfi').val("");
                    $('#direccionAfi').val("");
                    $('#ciudadAfi').val("");
                    $('#fechaAfi').val("");
                    $('#estadoAfi').val("");
                    $('#ocupacionAfi').val("");
                    app.application.navigate('#view-contratos','fade');
                    app.contratanteService.viewModel.ActualizarContratoCon=false;
                    app.contratanteService.viewModel.actualizarContrato=false;
                });
            });
        },
        limpiar:function(){
            $("#firma").jSignature("reset");           
        },
        limpiarC:function(){
            $("#firmaC").jSignature("reset");
        },
        
    });
    
    app.contratanteService={
      viewModel:new contratanteViewModel()  
    };
})(window);