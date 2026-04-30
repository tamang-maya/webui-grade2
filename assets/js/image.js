let isCat = true;
function changePic() {
    
    const photo = document.getElementById('photo');

    if(isCat) {
        photo.src ="assets/images/dog.jpg";
    }else{
        photo.src ="assets/images/cat.jpg";
    }
    isCat = !isCat;
}

