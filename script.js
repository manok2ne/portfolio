(function(){
  var LANGS=[["ko","KO"],["en","EN"],["ja","JA"]];
  document.querySelectorAll(".cx").forEach(function(root){
    var dir=root.dataset.dir,count=+root.dataset.count,label=root.dataset.title;
    var track=root.querySelector(".cx-track"),tabs=root.querySelector(".cx-tabs");
    function render(lang){
      track.innerHTML="";
      for(var i=1;i<=count;i++){
        var img=new Image();img.loading="lazy";img.decoding="async";
        img.src=dir+"/"+lang+"/"+i+".jpg";img.alt=label+" "+lang.toUpperCase()+" "+i+"/"+count;
        track.appendChild(img);
      }
      track.scrollLeft=0;
      tabs.querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.lang===lang)});
    }
    LANGS.forEach(function(l){
      var b=document.createElement("button");b.type="button";b.dataset.lang=l[0];b.textContent=l[1];
      b.addEventListener("click",function(){render(l[0])});tabs.appendChild(b);
    });
    root.querySelectorAll("[data-dir-btn]").forEach(function(b){
      b.addEventListener("click",function(){track.scrollBy({left:(b.dataset.dirBtn==="next"?1:-1)*track.clientWidth*.8,behavior:"smooth"})});
    });
    render("ko");
  });
})();
