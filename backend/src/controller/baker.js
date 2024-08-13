class Baker {
  constructor(uid, biscuit) {
    this._uid = uid;
    this._biscuit = biscuit;
  }

  // Save the customized comments regarding the procedure into user profile.
  save_comment(text) {
    // todo
  }

  // Save the evaluation of user for the tastes
  save_evaluate(sweet, texture, milk) {
    // todo
  }

  get uid() {
    return this._uid;
  }

  get biscuit() {
    return this._biscuit;
  }

  set biscuit(newBiscuit) {
    this._biscuit = newBiscuit;
  }
}

export default Baker;
