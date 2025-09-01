// This function allows asynchronous operations to be performed on each element of an array sequentially.
// It takes an array and a callback function as arguments.
// The callback function is awaited for each element, ensuring that each operation completes before moving to the next.
exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
