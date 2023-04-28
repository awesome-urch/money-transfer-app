const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TransactionController = require("../src/controllers/transaction_controller");

chai.use(sinonChai);
const { expect } = chai;

describe("Transaction tests", () => {

  afterEach(() => {
    sinon.restore();
  });

  it("should return false when the when the amount being transferred is less than or equal to zero", () => {
    const amount = -1;
    const result = new TransactionController().checkAmount(amount);
    expect(result).to.be.false;
  });

  it("should return false when the balance is less than the amount", () => {
    const balance = 100;
    const amount = 150;
    const result = new TransactionController().balanceIsMoreThanAmount(balance, amount);
    expect(result).to.be.false;
  });

  it("should return true when the balance is more than the amount", () => {
    const balance = 200;
    const amount = 150;
    const result = new TransactionController().balanceIsMoreThanAmount(balance, amount);
    expect(result).to.be.true;
  });

  it("should return true when the balance is equal to the amount", () => {
    const balance = 150;
    const amount = 150;
    const result = new TransactionController().balanceIsMoreThanAmount(balance, amount);
    expect(result).to.be.false;
  });

  it("should throw an error if amount is invalid", async function() {
    try {
      await new TransactionController().performTransaction({ user_id: 1, amount: "abc" });
    } catch (error) {
      expect(error).to.equal("amount is invalid");
    }
  }); 

  it("should throw an error if amount is negative amount", async function() {
    try {
      await new TransactionController().performTransaction({ user_id: 1, amount: -10 });
    } catch (error) {
      expect(error).to.equal("amount must be greater than 0");
    }
  });
  
});
