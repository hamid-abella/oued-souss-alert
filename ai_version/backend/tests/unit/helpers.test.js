// Test de la fonction calculateFloodRisk qui calcule le niveau de risque.
const { calculateFloodRisk } = require("../../src/utils/helpers");

describe("calculateFloodRisk", () => {

  test("doit retourner faible", () => {

    const result = calculateFloodRisk(1,4);

    expect(result).toBe("faible");

  });


  test("doit retourner modere", () => {

    const result = calculateFloodRisk(3,4);

    expect(result).toBe("modere");

  });


  test("doit retourner critique", () => {

    const result = calculateFloodRisk(5,4);

    expect(result).toBe("critique");

  });

});