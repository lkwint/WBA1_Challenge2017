

function openImg(imgName) {
    var i, x;
    x = document.getElementsByClassName("expandedImg");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(imgName).style.display = "block";
}


