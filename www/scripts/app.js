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
            console.log('Guardar en '+fileSystem.root.fullPath);
            console.log('Guardando archivo '+nombre);
            fileSystem.root.getFile(nombre+".txt", {create: true, exclusive: false}, function(fileEntry){
                fileEntry.createWriter(function(writer){
                    fileEntry.remove();
                    writer.seek(0); //Reiniciar archivo desde el inicio si ya existía
                    //writer.truncate();
                    writer.onwriteend = function(evt) { 
                        console.log("Archivo guardado exitosamente");
                        console.log(evt);
                    }; 
                    console.log('Tipo de info: '+typeof(info));
                    console.log(info);
                    console.log(info.length);
                    writer.write(JSON.stringify(info));
                    window.localStorage.setItem(nombre,true);
                }, app.fail);
            }, app.fail);
        }, app.fail);
    }
    app.leerArchivo = function(nombre,callBack){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            console.log('gotFS'); 
            console.log('Leido desde '+fileSystem.root.fullPath);
            fileSystem.root.getFile(nombre+".txt", {create: false, exclusive: false}, function(fileEntry){
                fileEntry.file(function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        console.log("Leído como texto");
                        //console.log(fileSystem.root);
                        var objeto = JSON.parse(evt.target.result); 
                        callBack(objeto);
                        
                    };
                    reader.readAsText(file);
                }, app.fail); 
            }, app.fail);
        }, app.fail);
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
            }, app.fail);
        }, app.fail);
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

                    }, app.fail);
                }
            };
            xhr.send();

        }, app.fail);
    }
    app.fail = function(e){
        console.log('Error');
        console.log(e);
    }
    
    document.addEventListener("deviceready", function () {
        
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