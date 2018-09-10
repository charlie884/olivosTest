(function (global) {
    var verContratoViewModel,
        app=global.app=global.app || {};
    
    verContratoViewModel = kendo.data.ObservableObject.extend({
        mostrar:function(e){
            var idContrato=e.view.params.id;
            window.localStorage.setItem('contratoActual',idContrato);
            console.log('idContrato: '+idContrato);
            Pace.track(function(){
    			$.ajax({
    				url: app.servidor+'consultar_datos_contranto',
    				type: 'GET',
    				dataType: 'json',
                    data:{id:idContrato}
    			}) 
    			.done(function(contrato) {
                    console.log('contrato arr: '+contrato.tipo_contrato.tipo_de_contrato);
                   
                    $('#idContratoInt').html(contrato.id);
                    $('#asesorContratoInt').html(contrato.asesor.name);                    
    				$('#sucursalContratoInt').html(contrato.sucursal_nombre.sucursal);
                    $('#tipoContratoInt').html(contrato.tipo_contrato.tipo_de_contrato); 
                    if(contrato.tipo_de_documento==1){
                        $('#tipoContratanteInt').text('Cédula');
                    }else if(contrato.tipo_de_documento==2){
                        $('#tipoContratanteInt').text('Tarjeta de identidad');
                    }else if(contrato.tipo_de_documento==3){
                        $('#tipoContratanteInt').text('Cédula extranjera');
                    }else if(contrato.tipo_de_documento==4){
                        $('#tipoContratanteInt').text('NIT');
                    }
                    $('#numeroContratanteInt').html(contrato.numero_de_documento);
                    $('#nombreContratanteInt').html(contrato.razon_social);
                    $('#telefonoContratanteInt').html(contrato.telefono);
                    $('#direccionContratanteInt').html(contrato.direccion);
                    $('#ciudadContratanteInt').html(contrato.ciudad.sucursal);
                    window.localStorage.setItem('Ciudad',contrato.ciudad.id);
                    $('#correoContratanteInt').html(contrato.correo_electronico);
                    $('#parentescoContratanteInt').html(contrato.parentesco.parentesco);
                    window.localStorage.setItem('CodigoParentesco',contrato.parentesco.codigo);
                    if(contrato.afiliado_principal.tipo_documento==1){
                         $('#tipoAfiliadoInt').text('Cédula');
                    }else if(contrato.afiliado_principal.tipo_documento==2){
                        $('#tipoAfiliadoInt').text('Tarjeta de identidad');
                    }else if(contrato.afiliado_principal.tipo_documento==3){
                        $('#tipoAfiliadoInt').text('Cédula extranjera');
                    }else if(contrato.afiliado_principal.tipo_documento==4){
                        $('#tipoAfiliadoInt').text('NIT');
                    }                    
                    $('#numeroAfiliadoInt').text(contrato.afiliado_principal.documento);
                    if(contrato.afiliado_principal.sexo=='H'){
                        $('#sexoAfiliadoInt').text('Masculino');
                    }else if(contrato.afiliado_principal.sexo=='M'){
                        $('#sexoAfiliadoInt').text('Femenino');
                    }
                   
                    $('#nombreAfiliadoInt').text(contrato.afiliado_principal.nombres);
                    $('#correoAfiliadoInt').text(contrato.afiliado_principal.correo_electronico);
                    $('#telefonoAfiliadoInt').text(contrato.afiliado_principal.telefono);
                    $('#direccionAfiliadoInt').text(contrato.afiliado_principal.direccion);
                    $('#ciudadAfiliadoInt').text(contrato.afiliado_principal.ciudad.sucursal);
                    window.localStorage.setItem('CiudadAfi',contrato.afiliado_principal.ciudad.id);
                    $('#fechaNaAfiliadoInt').text(contrato.afiliado_principal.fecha_nacimiento);
                    if(contrato.afiliado_principal.estado_civil=='S'){
                        $('#estadoCivAfiliadoInt').text('Soltero');    
                    }else if(contrato.afiliado_principal.estado_civil=='C'){
                        $('#estadoCivAfiliadoInt').text('Casado');    
                    }else if(contrato.afiliado_principal.estado_civil=='D'){
                        $('#estadoCivAfiliadoInt').text('Divorciado');    
                    }else if(contrato.afiliado_principal.estado_civil=='U'){
                        $('#estadoCivAfiliadoInt').text('Unión Libre');    
                    }else if(contrato.afiliado_principal.estado_civil=='V'){
                        $('#estadoCivAfiliadoInt').text('Viudo');    
                    }
                    
                    $('#ocupacionAfiliadoInt').text(contrato.afiliado_principal.ocupacion);
                    $.each(contrato.beneficiarios,function(index,valor){
                        console.log(valor);
                        $('#beneficiariosContratoInt').append(
                            '<strong>Nombre:</strong><div>'+valor.nombres+' '+valor.primer_apellido+' '+valor.segundo_apellido+'</div><strong>Documento:</strong><div>'+valor.documento+'</div><strong>Fecha de nacimiento:</strong><div>'+valor.fecha_nacimiento+'</div><strong>Parentesco:</strong><div>'+valor.parentesco.parentesco+'</div><br>'
                        );
                    });
                    $('#cuotaValorInt').text(contrato.valor.cuota);
                    $('#adicionalValorInt').text(contrato.valor.adicional);
                    $('#totalValorInt').text(contrato.valor.total_cuota);
                    $('#modalidadValorInt').text(contrato.valor.modalidad_de_pago);
                    $('#observacionesValorInt').text(contrato.valor.observaciones);
                    if(contrato.documento.documento_1 === app.urlServer || contrato.documento.documento_1 === app.urlServer+'null'){
                         $('#img1DocumentoInt').fadeOut();
                    }else{
                         $('#img1DocumentoInt').attr('src',contrato.documento.documento_1).fadeIn();
                    }
                    if(contrato.documento.documento_2 === app.urlServer || contrato.documento.documento_2 === app.urlServer+'null'){
                         $('#img2DocumentoInt').fadeOut();     
                    }else{
                        $('#img2DocumentoInt').attr('src',contrato.documento.documento_2).fadeIn();
                        
                    }
                    if(contrato.documento.documento_3 === app.urlServer || contrato.documento.documento_3 === app.urlServer+'null'){
                         $('#img3DocumentoInt').fadeOut();  
                    }else{                         
                         $('#img3DocumentoInt').attr('src',contrato.documento.documento_3).fadeIn(); 
                    }
                    if(contrato.documento.documento_4 === app.urlServer || contrato.documento.documento_4 === app.urlServer+'null'){
                         $('#img4DocumentoInt').fadeOut();
                    }else{
                         $('#img4DocumentoInt').attr('src',contrato.documento.documento_4).fadeIn();
                    }
                    if(contrato.documento.documento_5 === app.urlServer || contrato.documento.documento_5 === app.urlServer+'null'){
                         $('#img5DocumentoInt').fadeOut();
                    }else{
                         $('#img5DocumentoInt').attr('src',contrato.documento.documento_5).fadeIn();
                    }
                    if(contrato.documento.documento_6 === app.urlServer || contrato.documento.documento_6 === app.urlServer+'null'){
                         $('#img6DocumentoInt').fadeOut();
                    }else{
                         $('#img6DocumentoInt').attr('src',contrato.documento.documento_6).fadeIn();
                    }
                    if(contrato.documento.documento_7 === app.urlServer || contrato.documento.documento_7 === app.urlServer+'null'){
                         $('#img7DocumentoInt').fadeOut();
                    }else{
                         $('#img7DocumentoInt').attr('src',contrato.documento.documento_7).fadeIn();
                    }
                    if(contrato.documento.documento_8 === app.urlServer || contrato.documento.documento_8 === app.urlServer+'null'){
                         $('#img8DocumentoInt').fadeOut();
                    }else{
                         $('#img8DocumentoInt').attr('src',contrato.documento.documento_8).fadeIn();
                    }
                    if(contrato.documento.documento_9 === app.urlServer || contrato.documento.documento_9 === app.urlServer+'null'){
                         $('#img9DocumentoInt').fadeOut();
                    }else{
                         $('#img9DocumentoInt').attr('src',contrato.documento.documento_9).fadeIn();
                    }
                    if(contrato.documento.documento_10 === app.urlServer || contrato.documento.documento_10 === app.urlServer+'null'){
                         $('#img10DocumentoInt').fadeOut();
                    }else{
                         $('#img10DocumentoInt').attr('src',contrato.documento.documento_10).fadeIn();
                    }
                    if(contrato.documento.documento_11 === app.urlServer || contrato.documento.documento_11 === app.urlServer+'null'){
                         $('#img11DocumentoInt').fadeOut();
                    }else{
                         $('#img11DocumentoInt').attr('src',contrato.documento.documento_11).fadeIn();
                    }
                    if(contrato.documento.documento_12 === app.urlServer || contrato.documento.documento_12 === app.urlServer+'null'){
                         $('#img12DocumentoInt').fadeOut();
                    }else{
                         $('#img12DocumentoInt').attr('src',contrato.documento.documento_12).fadeIn();
                    }
                    
                    
                    $('#img1FirmaClienteInt').attr('src',contrato.firma_cliente);
                    $('#img2FirmaAsesorInt').attr('src',contrato.firma_asesor);
                   app.verContratoService.viewModel.numeroEstadoCivil=contrato.afiliado_principal.estado_civil;
                    
    			});
    		});
            
            
        },
        borrar:function(){
             $('#beneficiariosContratoInt').html('');
        },
        editarContrato:function(){
            var idContrato=window.localStorage.getItem('contratoActual');
            console.log(idContrato);
            $.ajax({
                url: app.servidor+'parentesco',
                type: 'GET',
                dataType: 'json',
                data:{id:idContrato}
            })
            .done(function(parentesco) {          
                
                $('#inputCiudadContratanteInt').val(window.localStorage.getItem('Ciudad'));
                $('#inputCiudadAfiliadoInt').val(window.localStorage.getItem('CiudadAfi'));
                
                $('#inputNumeroContratanteInt').val($('#numeroContratanteInt').text());
                $('#inputNombreContratanteInt').val($('#nombreContratanteInt').text());
                $('#inputTelefonoContratanteInt').val($('#telefonoContratanteInt').text());
                $('#inputDireccionContratanteInt').val($('#direccionContratanteInt').text());
                
                $('#inputCorreoContratanteInt').val($('#correoContratanteInt').text());
                $("#inputParentescoContratanteInt").val(window.localStorage.getItem('CodigoParentesco'));
                        
                $('#inputNumeroAfiliadoInt').val($('#numeroAfiliadoInt').text());
                $('#inputNombreAfiliadoInt').val($('#nombreAfiliadoInt').text());
                $('#inputCorreoAfiliadoInt').val($('#correoAfiliadoInt').text());
                $('#inputTelefonoAfiliadoInt').val($('#telefonoAfiliadoInt').text());
                $('#inputDireccionAfiliadoInt').val($('#direccionAfiliadoInt').text());
                
                
               
                
                $('#inputEstadoCivAfiliadoInt').html('<option id="op1" value="S">Soltero</option><option id="op2" value="C">Casado</option><option id="op3" value="D">Divorciado</option><option id="op4" value="U">Unión libre</option><option id="op5" value="V">Viudo</option>');
                
                if(app.verContratoService.viewModel.numeroEstadoCivil == 1){
                    $('#op1').attr('selected','selected');
                }else if(app.verContratoService.viewModel.numeroEstadoCivil == 2){
                    $('#op2').attr('selected','selected');
                }else if(app.verContratoService.viewModel.numeroEstadoCivil == 3){
                    $('#op3').attr('selected','selected');
                }else if(app.verContratoService.viewModel.numeroEstadoCivil == 4){
                    $('#op4').attr('selected','selected');
                }else if(app.verContratoService.viewModel.numeroEstadoCivil == 5){
                    $('#op5').attr('selected','selected');
                }
                console.log(app.verContratoService.viewModel.numeroEstadoCivil);
                
                $('#inputOcupacionAfiliadoInt').val($('#ocupacionAfiliadoInt').text());
            });
        },
        CargareditarContrato:function(){
            Pace.track(function(){
                $.ajax({
                    url: app.servidor+'get_sucursales',
                    type: 'GET',
                    dataType: 'json',
                }).done(function(sucursal){
                    $.each(sucursal,function(inde,valor){
                        $("#inputCiudadContratanteInt").append('<option value="'+valor.id+'">'+valor.sucursal+'</option>');                       
                        $("#inputCiudadAfiliadoInt").append('<option value="'+valor.id+'">'+valor.sucursal+'</option>');   
                    });                
                });
                $.ajax({
                    url: app.servidor+'parentesco',
                    type: 'GET',
                    dataType: 'json' 
                }).done(function(parentesco){
                    $.each(parentesco,function(inde,valor){
                        $("#inputParentescoContratanteInt").append('<option value="'+valor.codigo+'">'+valor.parentesco+'</option>');                   
                    });                 
                });
    		});
        },
        
        actualizarDatos:function(){
            var datos = {};
            datos.numero_de_documento= $('#inputNumeroContratanteInt').val();
            datos.razon_social= $('#inputNombreContratanteInt').val();
            datos.telefono= $('#inputTelefonoContratanteInt').val();
            datos.direccion= $('#inputDireccionContratanteInt').val();            
            datos.ciudad= $('#inputCiudadContratanteInt').val();            
            datos.correo_electronico= $('#inputCorreoContratanteInt').val();
            datos.parentesco= $('#inputParentescoContratanteInt').val();
            
            datos.numero_documento_afiliado= $('#inputNumeroAfiliadoInt').val();
            datos.nombre_afiliado= $('#inputNombreAfiliadoInt').val();
            datos.correo_afiliado= $('#inputCorreoAfiliadoInt').val();
            datos.telefono_afiliado= $('#inputTelefonoAfiliadoInt').val();
            datos.direccion_afiliado= $('#inputDireccionAfiliadoInt').val();
            datos.ciudad_afiliado= $('#inputCiudadAfiliadoInt').val();
            datos.estado_civil= $('#inputEstadoCivAfiliadoInt').val();
            datos.ocupacion= $('#inputOcupacionAfiliadoInt').val();
            
            datos.contrato = window.localStorage.getItem('contratoActual');
            
            Pace.track(function(){
                $.ajax({
                    url:app.servidor+'editar_datos',
                    type:'GET',
                    dataType:'json',
                    data:datos
                    
                }).done(function(valores){
                    console.log(valores);
                    if(valores){
                        app.application.navigate('#view-contratos','fade');                        
                    }
                    
                });
           });    
        },
        numeroEstadoCivil:0
    });
    
    
    
    app.verContratoService={
      viewModel:new verContratoViewModel()  
    };
})(window);