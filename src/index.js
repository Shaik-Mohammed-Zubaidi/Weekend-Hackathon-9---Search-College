const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connections } = require("mongoose");
const { connection } = require("./connector");

app.get("/findColleges", (req, res) => {
  let {
    name,
    state,
    city,
    course,
    maxFees,
    minPackage,
    exam,
  } = req.query;
  maxFees = maxFees && Number(maxFees) > 0 ? maxFees : 10000;
  minPackage = minPackage && Number(minPackage) > 0 ? minPackage : 0;
//   console.log(Number(minPackage));
  let filterObj={};
  name? filterObj["name"]= name : null;
  state? filterObj["state"]= state : null;
  filterObj["maxFees"]= { $lte: maxFees },
  filterObj["minPackage"]= { $gte: minPackage },
  city? filterObj["city"]= city : null;
  exam? filterObj["exam"]= { $in: [new RegExp(exam, "i")] }: null;
  course? filterObj["course"]= course : null;
  // console.log(filterObj);
  connection
    .find(filterObj)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});
// http://localhost:8080/findColleges?exam=CAT&name=indian&city=tiruchirappalli&state=tamil&course=pgpm&maxFees=20&minPackage=35
app.use(function (req, res) {
  res.sendStatus(404);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
