module.exports = class PyShellError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};