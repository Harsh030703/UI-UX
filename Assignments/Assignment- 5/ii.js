const arr=[42,7,19,73,11];
const max=Math.max(...arr);
const min=Math.min(...arr);
const asc=[...arr].sort((x,y)=>x-y);
const desc=[...arr].sort((x,y)=>y-x);
console.log({max,min,asc,desc});
