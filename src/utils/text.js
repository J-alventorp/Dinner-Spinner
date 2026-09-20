export function dc(s){ if(!s) return s; return s.charAt(0).toLowerCase()+s.slice(1); }
export function cap(s){ if(!s) return s; return s.charAt(0).toUpperCase()+s.slice(1); }

export function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var tmp=a[i]; a[i]=a[j]; a[j]=tmp;
  }
  return a;
}
