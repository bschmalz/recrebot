import dayjs from 'dayjs';

export const logError = (message: string, error: Error) => {
  const fs = require('fs');
  const timeStamp = dayjs().format('MM/DD/YYYY h:mm A	');
  console.error(timeStamp);
  console.error(message);
  console.error(error.message);

  var stream = fs.createWriteStream('logfile.log', { flags: 'a' });
  stream.once('open', () => {
    stream.write(
      '--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**' +
        '\r\n'
    );
    stream.write(timeStamp + '\r\n');
    stream.write(message + '\r\n');
    stream.write(error.message + '\r\n');
    stream.write(
      '--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**' +
        '\r\n'
    );
  });
};
