var Crawler = require("crawler");
var jsdom = require('jsdom');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            var result = $(".lottery-results table .start");
            var openData = [];

            for(var i=3,l=result.length; i<l; i++){
            	var td = result[i];
            	var length = td.attribs['data-period'].length;
            	var item = {
            		issue:td.attribs['data-period'].substring(length-3, length),
            		winNumber:td.attribs['data-win-number'],
            		dataPeriod:td.attribs['data-period']
            	};
            	if(typeof(item.winNumber) !== 'undefined')openData.push(item);
            }
            for(var i=0,l=openData.length; i<l; i++){
            	for(var j=i+1, jl=openData.length; j<jl; j++){
	            	if(parseInt(openData[i].issue, 10)>parseInt(openData[j].issue, 10)){
	            		var item = JSON.parse(JSON.stringify(openData[j]));
	            		openData[j] = openData[i];
	            		openData[i] = item;
	            	}
            	}
            }
            console.log(openData);
        }
        done();
    }
});
c.queue('http://caipiao.163.com/award/cqssc/');