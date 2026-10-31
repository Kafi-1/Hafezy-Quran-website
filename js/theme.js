(function(){
  var root=document.documentElement,theme="light";
  root.classList.add("js");
  try{
    var saved=localStorage.getItem("hq-theme");
    if(saved==="dark"||saved==="light"){theme=saved;}
    else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){theme="dark";}
  }catch(e){}
  root.setAttribute("data-theme",theme);
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute("content",theme==="dark"?"#0b2922":"#123e32");
})();
