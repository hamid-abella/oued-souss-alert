// Test du logger

const { log } = require("../../src/utils/logger");

describe("Logger", () => {

  test("doit écrire un message dans le fichier log", () => {

    expect(()=>{

      log("INFO","Test message");

    }).not.toThrow();

  });

});