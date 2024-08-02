class Ingredient {
  constructor(name, amount = 0) {
    this._name = name;
    this._amount = amount;
  }

  slight_add() {
    this._amount += 0.05;
  }

  slight_minus() {
    this._amount -= 0.05;
  }

  get name() {
    return this._name;
  }

  get amount() {
    return this._amount;
  }

  set name(newName) {
    this._name = newName;
  }

  set amount(newAmount) {
    this._amount = newAmount;
  }
}

class Oil extends Ingredient {
  constructor(name = "黄油", amount = 0) {
    super(name, amount);
  }
}

class Flour extends Ingredient {
  constructor(name = "低筋面粉", amount = 0) {
    super(name, amount);
  }
}

class Sugar extends Ingredient {
  constructor(name = "细砂糖", amount = 0) {
    super(name, amount);
  }
}

class Liquid extends Ingredient {
  constructor(name = "蛋白液", amount = 0) {
    super(name, amount);
  }
}

class Berry extends Ingredient {
  constructor(name = "蔓越莓干", amount = 0) {
    super(name, amount);
  }
}

export { Ingredient, Oil, Flour, Sugar, Liquid, Berry };
