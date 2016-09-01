var fs = require('fs');
var filecombination = "./csv/combination.csv";
var json = './source/test.json'






   fs.readFile(json, 'utf8', function (err, data)
   {
       if (err) throw err; // we'll not consider error handling for now
       var obj = JSON.parse(data);
       for (i = 0; i < obj.contributions.length; i++)
       {
         switch (obj.contributions[i].method)
         {
           case "combination":
           var category_ID = (obj.contributions[i].category_ID);
           for (c = 0; c < obj.contributions[i].categories.length; c++)
             {
               var categories = (obj.contributions[i].categories[c]);
               var CSV_row = category_ID+";"+categories+"\n";
               write(filecombination,CSV_row);
              }
           default:
       }
     }
   });


   function write(file,data){
     fs.appendFile(file, data , function (err) {
     });
   }
