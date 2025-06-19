// middleware/logger.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, body } = req;

  console.log(`\n---------------------🚀 [ API CALLED - ${originalUrl} ]-------------------------------`);
  console.log(`\n📎 URL            : ${originalUrl}`);
  console.log(`🔨 Method         : ${method}`);
  console.log(`📝 Request Body   :`, body);
  console.log(`🕒 Timestamp      : ${timestamp}`);

  const start = Date.now();

  // Capture any errors passed to next(err)
  let errorMsg = null;
  const originalSend = res.send;

  res.send = function (body) {
    if (res.statusCode >= 400) {
      errorMsg = body;
    }
    return originalSend.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`⏱️  Duration       : ${duration} ms`);
    console.log(`📤 Response Status: ${res.statusCode}`);

    if (errorMsg) {
      console.log(`❌ Error Response  :`, errorMsg);
    }

    console.log(`\n---------------------✅ [ API COMPLETED ]--------------------------------------------\n`);
  });

  next();
};

module.exports = logger;
