(function (global) {
    var app = global.app = global.app || {};
    app.urlServer = 'http://olivos.emerald.studio/';
    app.servidor = 'http://olivos.emerald.studio/index.php?option=com_functions&task=';
    app.makeUrlAbsolute = function (url) {
        var anchorEl = document.createElement("a");
        anchorEl.href = url;
        return anchorEl.href;
    };
    
    app.mostrarMensaje = function(titulo, mensaje, tipo, boton){
        swal({
          title: titulo,
          text: mensaje,
          type: tipo,
          confirmButtonText: boton
        });
    }
    app.guardarArchivo = function(info,nombre,img){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            console.log('gotFS');
            console.log('Guardar en '+fileSystem.root);
            console.log('Guardando archivo '+nombre+'.txt');
            console.log('Guardando info '+info);
            fileSystem.root.getFile(nombre+".txt", {create: true, exclusive: false}, function(fileEntry){
                fileEntry.createWriter(function(writer){
                    //fileEntry.remove();
                    //writer.seek(0); //Reiniciar archivo desde el inicio si ya existía
                    //writer.truncate();
                    writer.onwriteend = function(evt) {
                        console.log(evt);
                        console.log("Archivo guardado exitosamente");
                    };
                    //console.log('Tipo de info: '+typeof(info));
                    //console.log(info);
                    //console.log(info.length);
                    //console.log('string info '+JSON.stringify(info));
                    //writer.write(JSON.stringify(info));
                    var dataObj = new Blob([JSON.stringify(info)], { type: 'text/plain' });
                    writer.write(dataObj);
                    window.localStorage.setItem(nombre,true);
                }, function(error){
                    console.log(error);
                });
            }, function(error){
                    console.log(error);
                });
        }, function(error){
            console.log(error);
        });
    }
    app.leerArchivo = function(nombre,callBack){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            console.log('gotFS');
            console.log(nombre);
            console.log('Leido desde '+fileSystem.root);
            fileSystem.root.getFile(nombre+".txt", {create: true, exclusive: false}, function(fileEntry){
                fileEntry.file(function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        console.log("Leído como texto");
                        console.log(evt.target);
                        console.log(file);
                        var objeto = JSON.parse(evt.target.result);
                        callBack(objeto);
                        
                    };
                    reader.readAsText(file);
                }, function(error){
                       console.log(error);
                   });
            }, function(error){
                   console.log(error);
               });
        }, function(error){
           console.log(error);
       });
    }
    app.eliminarArchivo = function(nombre){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            console.log('gotFS');
            console.log('Leido desde '+fileSystem.root.fullPath);
            fileSystem.root.getFile(nombre+".txt", {create: false, exclusive: false}, function(fileEntry){
                fileEntry.remove(function (file) {
                    console.log("fichier supprimer");
                }, function () {
                    console.log("erreur suppression " + error.code);
                }, function () {
                    console.log("fichier n'existe pas");
            });
            },  function(error){
                    console.log(error);
                });
        },  function(error){
            console.log(error);
        });
    }
    app.descargarImagen = function(imagen,nombre,extension){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            console.log('file system open: ' + fs.name);
            var dirEntry = fs.root;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', imagen, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                if (this.status == 200) {
                    var blob = new Blob([this.response], { type: 'image/'+extension });
                    //saveFile(dirEntry, blob, nombre);
                    //saveFile(dirEntry, fileData, fileName)
                    dirEntry.getFile(nombre, { create: true, exclusive: false }, function (fileEntry) {

                        //writeFile(fileEntry, blob);
                        fileEntry.createWriter(function (fileWriter) {

                            fileWriter.onwriteend = function() {
                                console.log("Successful file write...");
                                console.log(blob.type);
                                console.log(fileEntry);
                                console.log(fs.root);
                            };

                            fileWriter.onerror = function(e) {
                                console.log("Failed file write: " + e.toString());
                            };

                            fileWriter.write(blob);
                        });

                    },  function(error){
                        console.log(error);
                    });
                }
            };
            xhr.send();

        }, function(error){
            console.log(error);
        });
    }
    app.fail = function(e){
        console.log('Error');
        console.log(e);
    }
    
    document.addEventListener("deviceready", function () {
        console.log('Cordova File');
        console.log(cordova.file);
        
        if(window.localStorage.getItem('usuario')){
            app.application = new kendo.mobile.Application(document.body, { skin: "flat", initial:"view-contratos"});
            if(!window.localStorage.getItem('consecutivo')){
                window.localStorage.setItem('consecutivo',0);
            }
            if(!window.localStorage.getItem('contratosGuardados')){
                window.localStorage.setItem('contratosGuardados','0');
            }
        }else{
            app.application = new kendo.mobile.Application(document.body, { skin: "flat", initial:"view-bienvenida"});
            if(!window.localStorage.getItem('consecutivo')){
                window.localStorage.setItem('consecutivo',0);
            }
            if(!window.localStorage.getItem('contratosGuardados')){
                window.localStorage.setItem('contratosGuardados','0');
            }
        }
        
        if (navigator && navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        
    }, false);
}(window)); 