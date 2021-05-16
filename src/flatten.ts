const mapKeys =
  (transform: (key: string) => string) =>
  <V>(record: Record<string, V>): Record<string, V> =>
    Object.keys(record).reduce(
      (aggregate, current) => ({
        ...aggregate,
        [transform(current)]: record[current],
      }),
      {}
    )

const flatMapRecord =
  <V, O>(transform: (key: string, value: V) => Record<string, O>) =>
  (record: Record<string, V>): Record<string, O> =>
    Object.keys(record).reduce((aggregate, current) => {
      const entries = transform(current, record[current])
      return { ...aggregate, ...entries }
    }, {})

const uppercase = (string: string): string => string.toUpperCase()

const casingChanges = new RegExp('(?=[A-Z])', 'g')

export const splitCasing = (string: string): Array<string> =>
  string.split(casingChanges)

const allUppercase = (string: string): boolean =>
  string === string.toUpperCase()

const keyTransform = (string: string): string => {
  if (allUppercase(string)) return string
  const parts = splitCasing(string)
  const reassembled = parts.join('_')
  return uppercase(reassembled)
}

const recordTransform =
  (prefix: string) =>
  (key: string, value: string | MixedEnvironment): FlatEnvironment => {
    const transformedKey = keyTransform(key)
    if (typeof value === 'string') {
      return {
        [`${prefix}${transformedKey}`]: value,
      }
    } else {
      return flatMapRecord(recordTransform(`${prefix}${transformedKey}__`))(
        value
      )
    }
  }

export type MixedEnvironment = { [key: string]: string | MixedEnvironment }
type FlatEnvironment = Record<string, string>

const transformKeys = mapKeys(keyTransform)

export const flatten = (environment: MixedEnvironment): FlatEnvironment => {
  const env = transformKeys(environment)
  const nestedEnv = flatMapRecord(recordTransform(''))(env)
  return nestedEnv
}
