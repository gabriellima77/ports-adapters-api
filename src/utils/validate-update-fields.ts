export function validateUpdateFields<T>(data: T, initialValue: T): T {
  const dataToChange = Object.keys(data).reduce<T>((result, key) => {
    const value = data[key];
    if (value) result[key] = data[key];

    return result;
  }, initialValue);

  return dataToChange;
}
