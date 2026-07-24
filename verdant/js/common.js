gsap.registerPlugin(ScrollTrigger);

/* Loader */
window.addEventListener('load',()=>{
  const loader=document.querySelector('.page-loader');
  if(loader){
    gsap.to(loader,{opacity:0,duration:.6,delay:.2,ease:'power2.out',onComplete:()=>loader.remove()});
  }
});

/* Custom cursor */
const dot=document.querySelector('.cursor-dot');
const ring=document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  if(dot){dot.style.left=mx+'px';dot.style.top=my+'px';}
});
function animRing(){
  rx+=(mx-rx)*0.15;
  ry+=(my-ry)*0.15;
  if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.btn,.magnetic,input,textarea').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring&&ring.classList.add('hover'));
  el.addEventListener('mouseleave',()=>ring&&ring.classList.remove('hover'));
});

/* Magnetic buttons */
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    gsap.to(el,{x:x*0.35,y:y*0.35,duration:.6,ease:'power3.out'});
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{x:0,y:0,duration:.7,ease:'elastic.out(1,0.4)'});
  });
});

/* Nav scroll state */
const nav=document.querySelector('.nav');
ScrollTrigger.create({
  start:'top -80',
  end:99999,
  toggleClass:{className:'scrolled',targets:nav}
});

/* Scroll progress */
gsap.to('.progress-bar',{
  width:'100%',
  ease:'none',
  scrollTrigger:{scrub:0.3,start:0,end:'max'}
});

/* Generic reveal */
document.querySelectorAll('.reveal').forEach(el=>{
  gsap.to(el,{
    opacity:1,y:0,duration:1.1,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 88%'}
  });
});
document.querySelectorAll('.reveal-stagger').forEach(group=>{
  const items=group.children;
  gsap.to(items,{
    opacity:1,y:0,duration:1,ease:'power3.out',stagger:0.12,
    scrollTrigger:{trigger:group,start:'top 85%'}
  });
  gsap.set(items,{opacity:0,y:40});
});

/* Tilt cards */
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5;
    const py=(e.clientY-r.top)/r.height-0.5;
    gsap.to(card,{
      rotateY:px*10,rotateX:-py*10,
      transformPerspective:800,
      duration:.5,ease:'power2.out'
    });
  });
  card.addEventListener('mouseleave',()=>{
    gsap.to(card,{rotateY:0,rotateX:0,duration:.7,ease:'elastic.out(1,0.5)'});
  });
});

/* Smooth anchor / lenis-like ease via native + gsap for internal same-page anchors */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      const target=document.querySelector(id);
      if(target){
        e.preventDefault();
        gsap.to(window,{duration:1.2,ease:'power3.inOut',scrollTo:{y:target,offsetY:80}});
      }
    }
  });
});
