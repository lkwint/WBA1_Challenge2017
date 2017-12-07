/* Funktionalitäten für die Hauptsteuerung
----------------------------------------------------------------------------- */

var mainControl = {};

mainControl.init = function() {
    
    // Music App
    var controlMusic = document.querySelector('[data-control-music]');
    controlMusic.addEventListener('click', function() {
        
        //Element selektieren
        var element = document.querySelector('[data-content-upper] [data-screen-content]');
        
        //Element entfernen\
        document.getElementById("map").classList.add("isHidden");

        //element.removeChild(element.firstElementChild);
        
        //Div-Element erzeugen
        var image = document.createElement('div');
        image.setAttribute("id", "music_player");
        //Attribute hinzufügen
        image.style.backgroundImage = 'url(images/tsl/tsl-music.svg)';
        image.style.backgroundSize = 'cover';
        image.classList.add('tsl-fixed');
        
        //Element hinzufügen
        element.appendChild(image);
    })
}
document.getElementById("map_trigger").addEventListener("click", function(){
    console.log("n");
    document.getElementById("music_player").classList.add("isHidden");
    document.getElementById("map").classList.remove("isHidden");

});

// Warten, bis alles geladen ist
document.addEventListener("DOMContentLoaded", function(event) {
    mainControl.init();
});
