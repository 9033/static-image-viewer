/*
<script src='/javascripts/viewImageWhenShowUpByScrollDown.js' defer></script>
<img img-src="src">
*/
var imgs=[];
for(i=0;i<document.images.length;i++){
  imgs.push( document.images[i] );
  imgs[i].style.height = "1000px";
}
var oldIE=( window.innerHeight == undefined);

function myFunction() {
  if(oldIE){
    //ie<=8
    window['innerHeight']=Math.max(document.documentElement.clientHeight,document.body.clientHeight);
  }

  for(i=0;i<imgs.length;i++){
      let imgRect=imgs[i].getBoundingClientRect();
      if( imgRect.top <= window.innerHeight ){ // 해당 이미지의 꼭대기가 가시 영역에 들어올떄.
        imgs[i].setAttribute('src',   imgs[i].getAttribute('img-src') );
        imgs[i].style.height = "";
        imgs.splice(i,1);
        break;
      }
  }
}
window.onresize=myFunction;
window.onscroll=myFunction;
window.onload=myFunction;