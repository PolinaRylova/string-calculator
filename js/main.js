'use strict';
(function () {
  const availableOperators = ['+', '-', '*', '/', '(', ')'];
  const availableOperands = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const splitToArray = function (string) {
    return string.split('');
  };

  const areBadNeighbors = function (item, currentIndex, previousIndex) {
    return (item === '*' || item === '/') && (currentIndex - previousIndex === 1);
  };

  const parseExpressions = function (array) {
    let parsedArray = [];
    let operand = '';
    let prevIndex;
    for (let i = 0; i < array.length; i++) {
      if (i === 0 && (array[i] === '*' || array[i] === '/')) {
        return [];
      }
      if (availableOperands.indexOf(array[i]) >= 0) {
        operand += array[i];
      } else if (availableOperators.indexOf(array[i]) >= 0) {
        if (array[i] === '+' || array[i] === '-') {
          prevIndex = i;
        }
        if (areBadNeighbors(array[i], i, prevIndex)) {
          return [];
        } else {
          parsedArray.push(operand);
          operand = '';
          parsedArray.push(array[i]);
        }
      }
      // добавляем в массив последний из операндов
      if (i === array.length - 1) {
        parsedArray.push(operand);
      }
    }
    /*
    Если юзер ввёл пустую строку, ничего не ввел и нажал "Посчитать", ввел неподдерживаемый символ
    или первыми ввёл "*" или "/", то функция вернёт пустой массив
    */
    return parsedArray;
  };

  const isParenthesisSumsEqual = function (array) {
    let openingParenthesisSum = 0;
    let closingParenthesisSum = 0;
    array.forEach(function (item) {
      if (item === '(') {
        openingParenthesisSum += 1;
      } else if (item === ')') {
        closingParenthesisSum += 1;
      }
    });
    return (openingParenthesisSum === closingParenthesisSum);
  };

  const calculateExpression = function (string) {
    return eval(string);
  };

  const showToDiv = function (value, selector) {
    const text = 'Ваш результат равен ';
    if (value !== '') {
      document.querySelector(selector).textContent = text + value;
    } else {
      document.querySelector(selector).textContent = "";
    }
  };

  const calculateInputtedExpression = function () {
    let taskField = document.querySelector('.task-field');
    // считываем введенную строку, вызываем функцию, преобразующую строку в массив, и сохраняем результат в переменной
    const inputtedExpressions = splitToArray(taskField.value);
    // разбираем массив введенных значений на операторы и операнды и складываем в новый массив
    const parsedMembers = parseExpressions (inputtedExpressions);
    let result = '';
    // Проверяем, заполнен ли массив
    if (parsedMembers.length > 0) {
      // если заполнен, делаем проверку равенства открывающих и закрывающих скобок
      // если открывающих и закрывающих скобок равное количество
      if (isParenthesisSumsEqual(parsedMembers)) {
        // преобразуем массив в строку
        let stringOfExpression = parsedMembers.join('');
        if (stringOfExpression !== "") {
          // вызываем функцию, вычисляющую из строки результат
          result = calculateExpression(stringOfExpression);
        } else {
          // иначе - показываем ошибку
          alert('Ошибка ввода. Вы не заполнили поле или ввели неподдерживаемый символ.')
        }
      } else {
        // иначе - показываем ошибку "Вы пропустили скобку"
        alert('Ошибка ввода. Вы пропустили скобку.')
      }
    } else {
      alert('Ошибка ввода.\n' +
          'Возможные причины:\n' +
          '- вы ввели неподдерживаемый символ или сочетание символов;\n' +
          '- вы ввели первыми символами "*" или "/".'
      );
    }
    // вызываем функцию, отображающюю результат
    showToDiv(result, '.result-block');
    // очищаем поле ввода
    taskField.value = '';
  };

  document.querySelector('.calculate-btn').addEventListener('click', calculateInputtedExpression);
})();
