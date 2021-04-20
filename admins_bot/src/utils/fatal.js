module.exports = (msg) => {
  console.error(`FATAL: ${msg}`);
  process.exit(1);
};
