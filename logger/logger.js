const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
require("dotenv").config();
const { connectionSingletonInstance } = require("../config/dbConnection");

class Logger {
  constructor(environment) {
    this.environment = environment;
    this.logger = this.createCustomLogger();
  }

  createCustomLogger() {
    const customFormat = format.printf(
      ({ timestamp, level, message, tenantId, userId }) => {
        return `[${timestamp}] [${level.toUpperCase()}] [${userId || "N/A"}] ${message}`;
      }
    );

    const logger = createLogger({
      level: this.environment === "production" ? "error" : "debug",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
      transports: [
        new DailyRotateFile({
          dirname: "logger/logs", // Directory for log files
          filename: "application-%DATE%.log", // File name pattern
          datePattern: "YYYY-MM-DD", // Date pattern for log file rotation
          zippedArchive: true, // Compress rotated files
          maxSize: "10m", // Max size of log files before rotation
          maxFiles: "30d", // Max number of days to keep log files
        }),
      ],
    });

    return logger;
  }

  // logToDB(tenantId, userId, log_type, log_object, message) {
  //   userId = userId || "N/A";
  //   let connectionObj =
  //     connectionSingletonInstance.getConnectionForTenant(tenantId);
  //   connectionObj
  //     .query(
  //       "CALL sp_createAppLog (:tenant_id, :mservice, :user_id,:log_type,:log_object,:log_details)",
  //       {
  //         replacements: {
  //           user_id: userId,
  //           log_type: log_type,
  //           log_object: log_object,
  //           log_details: message,
  //         },
  //       }
  //     )
  //     .then(/*v=>console.log(v)*/);
  // }

  log(
    message,
    userId = "N/A",
    logType = "info",
    // isDBLoggerEnabled = true
  ) {
    switch (logType.toLowerCase()) {
      case "debug":
        this.logger.debug(message, { userId });
        break;
      case "info":
        this.logger.info(message, { userId });
        break;
      case "warn":
        this.logger.warn(message, { userId });
        break;
      case "error":
        this.logger.error(message, { userId });
        break;
      default:
        this.logger.info(message);
        break;
    }

    // if (isDBLoggerEnabled)
    //   this.logToDB(userId, logType, null, message);
  }
}

const logger = new Logger(process.env.NODE_ENV);
// const apiLogger = (req, res, next) => {
//   if (process.env.NODE_ENV === "dev") {
//     const apiLogInfo = {
//       message: `API Call - Method: ${req.method}, Path: ${req.path}`,
//     };

//     if (req.body) {
//       // console.log("AAAAAAAAAAAAAAAAAAAAA",req.body)
//       apiLogInfo.message += `, Request Body: ${JSON.stringify(req.body)}`;
//     }
//     if (req.query) {
//       // console.log("AAAAAAAAAAAAAAAAAAAAA",req.query)
//       req.query.userId = 1
//       apiLogInfo.message += `, Query params: ${JSON.stringify(req.query)}`;
//     }

//     logger.log(apiLogInfo.message, "N/A", "N/A", "info", false);
//     const sendArgs = res.send;
//     res.send = function (data) {
//       const responseData = JSON.stringify(data);
//       logger.log(
//         `API Response - Status: ${res.statusCode}, Body: ${responseData}`,
//         "N/A",
//         "N/A",
//         "info",
//         false
//       );
//       res.send = sendArgs;
//       sendArgs.apply(res, arguments);
//     };
//   }
//   next();
// };
const setLogLevel = (logLevel) => {
  logger.logger.info("changing log level", logLevel);
  logger.logger.level = logLevel;
};

module.exports = { logger, setLogLevel };
