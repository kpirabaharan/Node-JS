// nested call
const fetchData = (callback) => {
  setTimeout(() => {
    callback('Done');
  }, 1500);
};

// async call
setTimeout(() => {
  console.log('Time is done!');
  fetchData((text) => {
    console.log(text);
  });
}, 2000);

console.log('Hello!');
