'use strict';
(function () {
  const availableOperators = ['+', '-', '*', '/'];
  const availableOperands = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const splitToArray = function (string) {
    return string.split('');
  };

  const parseExpressions = function (array) {
    let parsedArray = [];
    let operand = "";
    array.forEach(function (item, index, array) {
      if (availableOperands.indexOf(item) >= 0) {
        operand += item;
      } else if (availableOperators.indexOf(item) >= 0) {
        // если юзер первым символом ввел оператор, а не операнд
        if (operand === "") {
          parsedArray.push("0");
        } else {
          parsedArray.push(operand);
          operand = "";
        }
      // кладем в массив оператор (всегда следующим за операндом)
      parsedArray.push(item);
      }
      // добавляем в массив последний из операндов
      if (index === array.length - 1) {
        parsedArray.push(operand);
      }
    });
    /*
    Если юзер ввел пустую строку, неподдерживаемый символ или ничего не ввел
    и нажал "Посчитать", то вернётся пустой массив
    */
    return parsedArray;
  };

  const calculateExpression = function (string) {
    return eval(string);
  };

  const showToDiv = function (value, selector) {
    const text = "Ваш результат равен ";
    document.querySelector(selector).textContent = text + value;
  };

  const calculateInputtedExpression = function () {
    // сохраняем введенную строку
    let taskField = document.querySelector('.task-field');
    // вызываем функцию, преобразующую строку в массив, и сохраняем результат в переменной
    const inputtedExpressions = splitToArray(taskField.value);
    // разбираем массив введенных значений на операторы и операнды и складываем в новый массив
    const parsedMembers = parseExpressions (inputtedExpressions);
    /*
    Проверяем, заполнен ли массив: если заполнен, делаем вычисления,
    если пустой - выводим ошибку и очищаем поле ввода
     */
    if (parsedMembers.length > 0) {
      // преобразуем массив в строку
      let stringOfExpression = parsedMembers.join(" ");
      // вызываем функцию, вычисляющую из строки результат
      const result = calculateExpression(stringOfExpression);
      // вызываем функцию, отображающюю результат
      showToDiv(result, '.result-block');
    } else {
      alert('Ошибка ввода. Вы можете вводить цифры или знаки "+", "-", "*", "/".');
    }
    taskField.value = "";
  };

  document.querySelector('.calculate-btn').addEventListener('click', calculateInputtedExpression);
})();
