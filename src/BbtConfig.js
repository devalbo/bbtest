

let _typeforceEnabled = true;

function isTypeforceEnabled() {
  return _typeforceEnabled;
}

function setTypeforceEnabled(enabled) {
  _typeforceEnabled = enabled;
}

module.exports = {
  isTypeforceEnabled: isTypeforceEnabled,
  setTypeforceEnabled: setTypeforceEnabled
}