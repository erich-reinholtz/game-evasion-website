fetch('/beat-res')
  .then(data => {
     return data.json();
  })
  .then(data =>{

     for(i=0; i<10; i++){
        document.getElementById(i+1).innerHTML = data.list[i].id;
        document.getElementById((i+1) + "s").innerHTML = data.list[i].score;
  }
     
  });