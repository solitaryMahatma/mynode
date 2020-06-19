exports.assert = function (ok, ...args) {
  if (!ok) {
    throw new Error(args.join(' '))
  }
}
