const express = require("express");
const {
  senconnetion,
  acceptconnection,
  rejectconnection,
  getconnectionrequests,
  getconnection
} = require("../controler/Connections");
const isauthuser = require("../middleware/isauth");

const connectionroute = express.Router();

// Make sure these routes are correct
connectionroute.get('/send/:id', isauthuser, senconnetion);
connectionroute.get('/accept/:connectionid', isauthuser, acceptconnection);
connectionroute.get('/reject/:connectionid', isauthuser, rejectconnection);
connectionroute.get('/requests', isauthuser, getconnectionrequests);
connectionroute.get('/getstatus/:user', isauthuser, getconnection);

module.exports = connectionroute;