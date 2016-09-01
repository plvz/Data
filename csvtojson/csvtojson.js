var fs = require('fs');
var finaljson = "./result/test.json";
var liste_site = "./source/DMP_project.csv";
var liste_label = "./source/TaxoOguryv3.0.csv";
var jsonactuelle = "./source/scoring_settings.json";
var jsoncombination = "./source/combination.json"
var separatorline = /(\n)/;
var separatorchamp = /(;)/;
var regex = /og[0-9]{3}/;
// le csv doit etre enresitres sans cote (" ") et avec des point virgules


var Categorie = function (category_ID,weight) {
  this.category_ID = category_ID,
  this.method = "join",
  this.table = "history",
  this.column = "site",
  this.site = [],
  this.weight = weight

}



var entetejson = "{  \"contributions\": [";
write(finaljson,entetejson);

fs.readFile(liste_site, 'utf8', function (err,data) {
  var listcategorie = [];
  var sitecategorie = [];
  var category_ID;
    if (err) {
      return console.log(err);
    }

  // Tokenise the input string
    line = data.split(separatorline);
    for (i = 0; i < line.length; i++)
    {
      values = line[i].split(separatorchamp);
      var cat = values[0];

      if (regex.test(values[0]))
      {
            if (category_ID == cat)
            {

                sitecategorie.push(values[2]);

            }
            else
            {
              listcategorie.push(sitecategorie);
              category_ID = values[0];
              sitecategorie = [];
              listcategorie.push(category_ID);
              sitecategorie.push(values[2]);

            }

      }
    }
  parserJSON(listcategorie);
  });




var listID = [];
function parserJSON(listcategorie)
{
  fs.readFile(jsonactuelle, 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now
      var obj = JSON.parse(data);
      for (i = 0; i < obj.contributions.length; i++)
      {
        switch (obj.contributions[i].method)
        {
          case "patternMatching":
            if( listID.indexOf(obj.contributions[i].category_ID) == -1)
              {
                listID.push(obj.contributions[i].category_ID);
                var category_ID = (obj.contributions[i].category_ID);
                var table = (obj.contributions[i].table);
                var column = (obj.contributions[i].column);
                var weight = (obj.contributions[i].weight);
                var categorie = new Categorie(category_ID,weight);
                for(i = 1; i < listcategorie.length; i++)
                  {
                    if(listcategorie[i] == category_ID)
                    {
                      categorie.site=listcategorie[i+1];
                    }
                  }
                var jsonString= JSON.stringify(categorie);
                write(finaljson,jsonString+",");
                }
          break;
          default:
            var jsonString= JSON.stringify(obj.contributions[i]);
            write(finaljson,jsonString+",");
          break;

        }
      }
      ecriturecombination();
  });

}

function ecriturecombination(){
fs.readFile(jsoncombination, 'utf8', function (err, data) {
  if (err) throw err; // we'll not consider error handling for now
  write(finaljson,data);


});
}
function write(file,data){
  fs.appendFile(file, data , function (err) {
  });
}
