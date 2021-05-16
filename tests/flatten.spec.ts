import { flatten, splitCasing } from '../src/flatten'

describe('Split Casing', () => {
  it('splits strings where casing changes', () => {
    expect(splitCasing('thisIsABigCamelCaseBoi')).toMatchObject([
      'this',
      'Is',
      'A',
      'Big',
      'Camel',
      'Case',
      'Boi',
    ])
  })
})

describe('Flatten', () => {
  it('passes through normal environment key/value pairs', () => {
    expect(
      flatten({
        FOO: 'bar',
      })
    ).toMatchObject({
      FOO: 'bar',
    })
  })
  it('uppercases keys', () => {
    expect(
      flatten({
        foo: 'bar',
      })
    ).toMatchObject({
      FOO: 'bar',
    })
  })
  it('splits keys by casing changes', () => {
    expect(
      flatten({
        fooBar: 'baz',
      })
    ).toMatchObject({
      FOO_BAR: 'baz',
    })
  })
  it('flattens nested objects to encoded environment record', () => {
    expect(
      flatten({
        foo: {
          bar: 'baz',
        },
      })
    ).toMatchObject({
      FOO__BAR: 'baz',
    })
  })
  it('flattens nested object with sibling properties', () => {
    expect(
      flatten({
        foo: {
          bar: 'baz',
          qux: {
            gorge: 'grault',
            fredGarply: {
              melange: 'bloot',
              findle: 'frud',
            },
          },
        },
      })
    ).toMatchObject({
      FOO__BAR: 'baz',
      FOO__QUX__GORGE: 'grault',
      FOO__QUX__FRED_GARPLY__MELANGE: 'bloot',
      FOO__QUX__FRED_GARPLY__FINDLE: 'frud',
    })
  })
})
