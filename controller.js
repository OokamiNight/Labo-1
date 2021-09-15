const url = require('url');
const queryString = require('query-string');
const { Console } = require('console');

//validation d'erreurs
function operatorValide(op)
{
  if(op == '!' || op == 'p' || op == 'np' || op == '+' || op == '-' || op == '*' || op == '/' || op == '%')
     return "";
  else 
    return "operator isn't valide.";
}
function errorArg (length, op)
{
    let howMany;
    if(op == '!' || op == 'p' || op == 'np') howMany = length -1;
    else if(op == '+' || op == '-' || op == '*' || op == '/' || op == '%') howMany = length - 2;

    if(howMany > 0) return "too much arguments. How many excess number : [" + howMany + "].";
    else if (howMany < 0) return "not enought arguments. How many number to add: [" + Math.abs(howMany) + "].";
    else return length;
}
function errorType (arg, nameArg)
{
  if(isNaN(arg) || arg.length == 0) return "'" + nameArg + "' " + "parameter is not a number. ";
  else return "";
}

//calcul la réponse mathématique
function reponseMath (op, x, y)
{
  switch(op)
  {
    case '+': return x+y;
    case '-': return x-y;
    case '*': return x*y;
    case '/': return x/y;
    case '%': return x%y;
    case '!':
      let calcul = 1;
      for(let i = 1; i <= x; i++)
        calcul = calcul * i;
      
      return calcul;
    case 'p': 
      if (x === 1) return false;
      else if (x === 2 || x === 3) return true;

      for (let i = 2; i < x; i++) 
          if (x % i == 0) return false;

      return true;
    case 'np':
      var tabNbPremiers = [2,3];
      let i = 2;
      do
      {
        var premier = true;
        for(let j=2; j < x; j++)
          if(i % j == 0) premier = false;

        if(premier) 
          tabNbPremiers.push(i);

        i++;
      } while(tabNbPremiers.length != x);

      return tabNbPremiers[x-1];
  }
}
exports.maths = function(req, res) {

  const argumentsUrl =  req.url.substr(req.url.indexOf("?") +1);
  const parsed = queryString.parse(argumentsUrl);

  if(parsed.op == ' ') parsed.op = '+';

  //vérifie toutes les erreurs possible et donne les messages d'erreur s'il y en a
  let length = errorArg(Object.keys(parsed).length -1, parsed.op);
  var messageError = "";

  if(length === 1)
    messageError = errorType(parsed.n, 'n') + operatorValide(parsed.op);
  else if(length === 2) 
    messageError = errorType(parsed.x, 'x') + errorType(parsed.y, 'y') + operatorValide(parsed.op);
  else 
    messageError = length;

  //créer le réponse renvoyée à l'utilisateur
  var valeurFinale = {};
 
  //vérifie s'il y a un message d'erreur et créer la réponse avec l'option erreur
  if(messageError.trim())
  {
    if(length === 1)
    {
      valeurFinale =
      {
        "op": parsed.op,
        "n" : parsed.n,
        "error" : messageError
      };
    }
    else if(length === 2)
    {
      valeurFinale =
      {
        "op": parsed.op,
        "x" : parsed.x,
        "y" : parsed.y,
        "error" : messageError
      };
    }
    else
    {
      valeurFinale =
      {
        "op": parsed.op,
        "error" : messageError
      };
    }
    
  }
  //créer la réponse avec la réponse du calcul
  else
  {
    if(length === 1)
    {
      var reponse = reponseMath(parsed.op, eval(parsed.n), null);
      valeurFinale = {
        "op": parsed.op,
        "n" : parsed.n,
        "value" : reponse
      };
    }
    else
    {
      var reponse = reponseMath(parsed.op, eval(parsed.x), eval(parsed.y));
      valeurFinale = {
        "op": parsed.op,
        "x" : parsed.x,
        "y" : parsed.y,
        "value" : reponse
      };
    }
  }

  console.log(valeurFinale);
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(valeurFinale));
}

exports.invalidUrl = function(req, res) {
   
  var response = [
     {
       "message": "Endpoint incorrect. Les options possibles sont "
     },
     availableEndpoints
   ];
   res.statusCode = 404;
   res.setHeader('content-Type', 'Application/json');
   res.end(JSON.stringify(response));
}
const availableEndpoints = [
  {
    method: "GET",
    maths: "/api/maths"
  }
];