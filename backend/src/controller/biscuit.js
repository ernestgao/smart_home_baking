class Biscuit {
  // precentage range of each tastes
  static sweet_range = [36, 32, 27, 21, 14, 11, 10];
  static texture_range = [40, 38, 33, 26, 19, 13, 10];
  static milk_range = [10.5, 9.5, 8.5, 7, 5, 3, 0];

  // amount for the each taste scale
  static sugar_values = [33.75, 30, 23, 15.75, 12.5, 10];
  static oil_values = [40, 37.5, 31.25, 23, 15, 11.25];
  static liquid_values = [10, 10, 8, 6, 0, 0];

  // calorie reference per gram
  static oil_calorie = 7.17;
  static sugar_calorie = 3.87;
  static flour_calorie = 3.64;
  static liquid_calorie = 0.52;
  static berry_calorie = 3.25;

  constructor(oil, flour, sugar, liquid, berry) {
    this._oil = oil;
    this._flour = flour;
    this._sugar = sugar;
    this._liquid = liquid;
    this._berry = berry;
    this._total = oil.amount + sugar.amount + flour.amount + liquid.amount;
    this._num_portion = 0;
  }

  update_total() {
    this._total =
      this._oil.amount +
      this._sugar.amount +
      this._flour.amount +
      this._liquid.amount;
  }

  // Initialized the amount of each ingredients based on the number of portions
  plan(num_portion = 1) {
    this._num_portion = num_portion;
    this._oil.amount = 110 * num_portion;
    this._flour.amount = 185 * num_portion;
    this._sugar.amount = 80 * num_portion;
    this._liquid.amount = 25 * num_portion;
    this._berry.amount = 55 * num_portion;
    this.update_total();
    return this.get_amounts();
  }
  // display and return amounts
  get_amounts() {
    return {
      黄油: this._oil.amount,
      低筋面粉: this._flour.amount,
      细砂糖: this._sugar.amount,
      蛋白液: this._liquid.amount,
      蔓越莓干: this._berry.amount,
    };
  }

  // user enter the amount of sugar and oil, give the suggested amount of liquid and flour.
  adjust_amount(sugar, oil) {
    this._sugar.amount = sugar;
    this._oil.amount = oil;
    this._flour.amount = sugar + oil;
    this._liquid.amount = this.total - (sugar + oil) * 2;
    this.update_total();
    return {
      黄油: this._oil.amount,
      低筋面粉: this._flour.amount,
      细砂糖: this._sugar.amount,
      蛋白液: this._liquid.amount,
      蔓越莓干: this._berry.amount,
    };
  }

  // Based on the ratio of each ingredients, give the sweetness, texture, and milk flavor on a scale of 6 in an object form
  // sweet: 6 -> sweetest, 1 -> least sweet
  // texture: 6 -> fluffy, 1 -> crunchy
  // milk: 6 -> light, 1 -> strong
  taste_predict() {
    let sweet, texture, milk;
    try {
      sweet = this.get_scale(
        (this._sugar.amount / this._total).toFixed(3),
        Biscuit.sweet_range,
        "sugar"
      );
      texture = this.get_scale(
        (this._oil.amount / this._total).toFixed(3),
        Biscuit.texture_range,
        "oil"
      );
      milk = this.get_scale(
        (this._liquid.amount / this._total).toFixed(3),
        Biscuit.milk_range,
        "liquid"
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    return {
      甜度: sweet,
      口感: texture,
      奶香: milk,
    };
  }

  // helpers that return the scale, throws error if too much or too less
  get_scale(percentage, range, ingredient) {
    percentage = percentage * 100;
    if (percentage > range[0]) {
      throw new Error(`Too much ${ingredient}`);
    }

    let scaleValue;
    switch (true) {
      case percentage >= range[6] && percentage <= range[5]:
        scaleValue = 1;
        break;
      case percentage > range[5] && percentage <= range[4]:
        scaleValue = 2;
        break;
      case percentage > range[4] && percentage <= range[3]:
        scaleValue = 3;
        break;
      case percentage > range[3] && percentage <= range[2]:
        scaleValue = 4;
        break;
      case percentage > range[2] && percentage <= range[1]:
        scaleValue = 5;
        break;
      case percentage > range[1] && percentage <= range[0]:
        scaleValue = 6;
        break;
      default:
        throw new Error(`Too less ${ingredient}`);
    }
    return scaleValue;
  }

  // Based on the value of the tastes, provide a sugeested amount of ingredients
  adjust_portion(sweet, texture, milk) {
    let sugar, oil, liquid;
    let sr = 7 - texture;
    if (Math.abs(sweet - sr) <= 1) {
      sugar = parseFloat(
        (
          (Biscuit.sugar_values[sweet - 1] + Biscuit.sugar_values[sr - 1]) /
          2
        ).toFixed(2)
      );
      oil = Biscuit.oil_values[texture] + Biscuit.sugar_values[sweet] - sugar;
      liquid = Biscuit.liquid_values[milk - 1];
      this._sugar.amount = parseFloat(
        (this._flour.amount * (sugar / (sugar + oil))).toFixed(2)
      );
      this._oil.amount = parseFloat(
        (this._flour.amount * (oil / (sugar + oil))).toFixed(2)
      );
      this._liquid.amount = parseFloat(
        (this._total * (liquid / ((sugar + oil) * 2 + liquid))).toFixed(2)
      );
      this.update_total;
      return this.get_amounts();
    } else if (Math.abs(sweet - sr) == 2) {
      let s = (sr + sweet) / 2;
      sugar = Biscuit.sugar_values[s - 1];
      oil = Biscuit.oil_values[7 - s - 1];
      liquid = Biscuit.liquid_values[milk - 1];
      this._sugar.amount = parseFloat(
        (this._flour.amount * (sugar / (sugar + oil))).toFixed(2)
      );
      this._oil.amount = parseFloat(
        (this._flour.amount * (oil / (sugar + oil))).toFixed(2)
      );
      this._liquid.amount = parseFloat(
        (this._total * (liquid / ((sugar + oil) * 2 + liquid))).toFixed(2)
      );
      this.update_total;
      return this.get_amounts();
    } else {
      return this.plan(this._num_portion);
    }
  }

  // Calculate the total calories of the cookie
  caculate_calorie() {
    return (
      this._sugar.amount * Biscuit.sugar_calorie +
      this._oil.amount * Biscuit.oil_calorie +
      this._flour.amount * Biscuit.flour_calorie +
      this._liquid.amount * Biscuit.liquid_calorie +
      this._berry.amount * Biscuit.berry_calorie
    ).toFixed(2);
  }
}

export default Biscuit;
