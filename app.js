var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var DB = require("./db/mongodb");
var morgan = require("morgan");

const {
  exceptionHandler,
} = require("./components/exception/exception_handler");
const NotFoundException = require("./components/exception/exception_not_found");

app.use(morgan("short"));
app.use(cors());
DB.connect();

var os = require("os");
var ifaces = os.networkInterfaces();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "content-type, x-access-token"); //1
  next();
});

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ("IPv4" !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ":" + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

app.use("/api/v1/appVer", require("./routers/app_version"));
app.use("/api/v1/notify", require("./routers/notify"));
app.use("/api/v1/account", require("./routers/account"));
app.use("/api/v1/token", require("./routers/token"));
app.use("/api/v1/auth", require("./routers/auth"));

app.use(exceptionHandler);

app.use((req, res, next) => {
  exceptionHandler(
    new NotFoundException(404, "잘못된 요청입니다.", "Not Found Page"),
    req,
    res,
    next
  );
});

var port = process.env.PORT || 2394;
var server = app.listen(port, function () {
  console.log("Express server has started on port " + port);
});
