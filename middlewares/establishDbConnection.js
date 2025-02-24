const { connectionSingletonInstance } = require("../config/dbConnection");
const checkDBConnectionStatus = require("../utils/checkConnectionStatus");
const { logger } = require("../loggers/logger");

const logMessage = (message, tenantId, userId, logType, isDBLoggerEnabled) =>
{
   logger.log(message, tenantId, userId, logType, isDBLoggerEnabled);
}

module.exports = async (req, res, next) => {
  try {
    let tenentId = req.headers.tenentid;
   
    if (tenentId) {
      let connectionObj = connectionSingletonInstance.getConnectionForTenant(tenentId);
      
      if (checkDBConnectionStatus(connectionObj)) {
        next();
      } else {
        await connectionSingletonInstance.setConnectionForTenent(tenentId, logMessage);
        next();
      }
    } 
    else
      res.status(400).send({
        status: 400,
        data: {},
        messageCode: "tenentIdMissingError",
      });
  } catch (err) {
    logger.log(JSON.stringify(err.stack), "N/A", "N/A", 'error',false);
    res.status(500).send({
      status: 500,
      error: err,
      messageCode: "dbConnectionError",
    });
  }
};
