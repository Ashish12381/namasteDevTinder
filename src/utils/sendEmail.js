const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Text: {
          Data: "Someone has shown interest in your DevTinder profile.",
        },
      },
      Subject: {
        Data: "New Connection Request",
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const command = createSendEmailCommand(
    "apal74180@gmail.com",
    "reply@devtinder.info"
  );

  try {
    const response = await sesClient.send(command);
    console.log("SES Response:", response);
    return response;
  } catch (err) {
    console.error("SES Error:", err);
    throw err;
  }
};

module.exports = { run };