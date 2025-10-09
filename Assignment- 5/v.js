function processNumbers(arr){
  return arr.filter(n=>n%2===0).map(n=>n*2).reduce((s,n)=>s+n,0);
}
console.log(processNumbers([1,2,3,4,5,6,7,8]));
