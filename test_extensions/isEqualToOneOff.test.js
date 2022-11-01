const isEqualToOneOff = require("./isEqualtoOneOff.js")

describe("isEqualToOneOff", () => {
  test("one object is equal", () => {
    const result = isEqualToOneOff({ name: "g" }, [{ name: "g" }])

    expect(result.pass).toBe(true)
  })

  test("two objects both equal", () => {
    const result = isEqualToOneOff({ name: "g" }, [
      { name: "g" },
      { name: "g" },
    ])

    expect(result.pass).toBe(true)
  })

  test("two objects one equal", () => {
    const result = isEqualToOneOff({ name: "g" }, [
      { name: "g" },
      { name: "b" },
    ])

    expect(result.pass).toBe(true)
  })

  test("two objects none equal", () => {
    const result = isEqualToOneOff({ name: "g" }, [
      { name: "a" },
      { name: "a" },
    ])

    expect(result.pass).toBe(false)
  })

  test("no objects", () => {
    const result = isEqualToOneOff({ name: "g" }, [])

    expect(result.pass).toBe(false)
  })
})
