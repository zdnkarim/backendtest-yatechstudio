const contiguousArray = (a, m, k) => {
  let total = 0;
  const length = a.length;
  for (let i = 0; i <= length - m; i++) {
    let array = [];
    for (let j = i; j < i + m; j++) {
      array.push(a[j]);
    }
    const answer = findK(array, total);
    total += answer;
  }
  console.log(
    `For a= [${a}], m=${m}, and k=${k}, the output should be solution(a, m, k) = ${total}.`
  );
};

const findK = (array) => {
  let a = [];
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (i !== j) {
        a.push(array[i] + array[j]);
      }
    }
  }
  if (a.includes(10)) return 1;
  return 0;
};

contiguousArray([2, 4, 7, 5, 3, 5, 8, 5, 1, 7], 4, 10);
contiguousArray([15, 8, 8, 2, 6, 4, 1, 7], 2, 8);
