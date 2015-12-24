var moment =require('moment');
var now=moment();

/*console.log(now.format());
now.subtract(1, 'year');
console.log(now.format());
console.log(now.format('MMM Do YYYY, h:mma')); //oct 5th 2015,6:45pm*/
/*console.log(now.format('X'));
console.log(now.valueOf());*/
var timestamp=1450973787586;
var timestampMoment=moment.utc(timestamp);
console.log(timestampMoment.local().format('h:mm a'));// to convert local time we use local() just before format