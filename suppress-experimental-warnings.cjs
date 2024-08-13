const originalEmit = process.emit;

process.emit = function (name, data, ..._args) {
  if (
    name === "warning" &&
    typeof data === "object" &&
    data.name === "ExperimentalWarning" &&
    /VM Modules is an experimental feature/.test(data.message)
  ) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};
