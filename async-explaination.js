console.log('in javascript');
setTimeout(() => {
  console.log('meaning we never block (aka wait) for a long op')
}, 0);
console.log('things are async')