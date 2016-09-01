var fs = require('fs');
var filepattern = "pattern.csv";
var filejoin = "./csv/join.csv";
var filecategory = "./csv/category.csv";
var tazonomy = "./source/TaxoOguryv3.0.csv";
var json = './source/test.json'
var separatorline = /(\n)/;
var separatorchamp = /(;)/;
var regex = /og[0-9]{3}/;
// le csv doit etre enresitres sans cote (" ") et avec des point virgules


var Categorie = function (category_ID,table,column,site,weight) {
  this.category_ID = category_ID,
  this.table = table,
  this.column = column,
  this.site = site,
  this.weight = weight,
  label= "",
  treeparent= "",
  description = ""

  this.writeindoc = function(){

      //console.log(row);
      if(this.site != undefined)
      {
        for(t = 0; t < this.site.length; t++)
          {
            var row = this.category_ID+";"+this.table+";"+this.column+";"+this.site[t]+";"+this.weight.toString()+"\n";
            write(filejoin,row);
          }
      }
      var row = this.category_ID+";"+this.label+";"+this.treeparent+";"+this.description+"\n";
      write(filecategory,row);

    };

}






function parserCSV(categorie,category_ID)
{

  fs.readFile(tazonomy, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

  // Tokenise the input string
    line = data.split(separatorline);
    for (i = 0; i < line.length; i++)
    {
      values = line[i].split(separatorchamp);
      if (regex.test(values[0]))
      {

            var cat = values[0];
            if (category_ID == cat)
            {

              categorie.label =values[20];
              if (values[20])
              {
                categorie.treeparent = values[14]+"/"+values[16]+"/"+values[18]+"/"+values[20];
              }
              else if (values[18])
              {
                categorie.treeparent = values[14]+"/"+values[16]+"/"+values[18];

              }
              else
              {
                categorie.treeparent = values[14]+"/"+values[16];
              }

              categorie.description = values[22];
              categorie.writeindoc();

            }

      }
    }
  });
}





fs.readFile(json, 'utf8', function (err, data)
{
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);
    var listcombination = new Array();
    for (i = 0; i < obj.contributions.length; i++)
    {
      switch (obj.contributions[i].table)
      {
        case "history":
          var category_ID = (obj.contributions[i].category_ID);
          var table = (obj.contributions[i].table);
          var column = (obj.contributions[i].column);
          var site = (obj.contributions[i].site);
          var weight = (obj.contributions[i].weight);
          var categorie = new Categorie(category_ID,table,column,site,weight);
          parserCSV(categorie,category_ID);
          break;
        case "apps" :
          var category_ID = (obj.contributions[i].category_ID);
          var table = (obj.contributions[i].table);
          var column = (obj.contributions[i].column);
          var joinKey = (obj.contributions[i].joinKey);
          var weight = (obj.contributions[i].weight);
          var CSV_row = category_ID+";"+table+";"+column+";"+joinKey+";"+weight+"\n";
          write(filejoin,CSV_row);
          break;
        case "inventory":
          var category_ID = (obj.contributions[i].category_ID);
          var table = (obj.contributions[i].table);
          var column = (obj.contributions[i].column);
          var joinKey = (obj.contributions[i].joinKey);
          var weight = (obj.contributions[i].weight);
          var CSV_row = category_ID+";"+table+";"+column+";"+joinKey+";"+weight+"\n";
          write(filejoin,CSV_row);
          break;
        default:
    }
  }
});


function write(file,data){
  fs.appendFile(file, data , function (err) {
  });
}
