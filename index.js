const color = require('colors');

[min, max] = process.argv.slice(2).map(Number);

// валидация введённых значений
if (isNaN(min) || isNaN(max)) return console.error(color.red('Введите корректные числа.'));
else if (min < 0 || max < 0) return console.error(color.red('Числа должны быть положительными.'));
else if (max <= min) return console.error(color.red('Второе число должно быть больше первого.'))

console.log(color.green(min), color.red(max));

// поиск простых чисел в заданном диапазоне

let count = 0;
let result = false;

for (let i = min; i <= max; i++) {
    if (isPrime(i)) {
        result = true;
        setColor(i);
    }
}

if (!result) {
    return console.error(color.red('В заданном диапазоне нет простых чисел.'));
}

function isPrime(num) {
    for (let j = 2; j < num; j++) {
        if (num % j === 0) return false;
    }
    return num;
}

function setColor(num) {
    count++;
    switch (count) {
        case 1:
            console.log(color.green(num));
            break;
        case 2:
            console.log(color.yellow(num));
            break;
        case 3:
            console.log(color.red(num));
            count = 0;
            break;
    }
}