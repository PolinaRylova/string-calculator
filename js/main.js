'use strict';
(function () {
  const availableOperators = ['+', '-', '*', '/'];
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
        throw new Error('Ошибка ввода. Первыми символами не могут быть "*" и "/".');
      }
      if (availableOperands.indexOf(array[i]) >= 0) {
        operand += array[i];
      } else if (availableOperators.indexOf(array[i]) >= 0) {
        if (array[i] === '+' || array[i] === '-') {
          prevIndex = i;
        } else if (areBadNeighbors(array[i], i, prevIndex)) {
          throw new Error('Ошибка ввода. Не поддерживаются сочетания "+*", "-*, "+/", "-/".');
        }
        parsedArray.push(operand); // кладем в массив хранящееся в операнде значение
        operand = ''; // очищаем переменную операнда
        parsedArray.push(array[i]); // кладем в массив оператор
      }
      if (i === array.length - 1) {
        if (availableOperators.indexOf(array[i]) >= 0) { // проверяем на ошибки ввода
          throw new Error('Ошибка ввода. В конце выражения не должно быть знаков - только цифры.');
        } else {
          parsedArray.push(operand); // добавляем в массив последний из операндов
        }
      }
    }
    if (parsedArray.length > 0) {
      console.log('parsedArray равен ' + parsedArray);
      return parsedArray;
    } else {
      throw new Error('Ошибка ввода. Вы ввели неподдерживаемый символ или отправили пустую строку.');
    }
  };

  const calculateOperands = function (previousOperand, operator, currentOperand) {
    let result;
    switch (operator) {
      case '*':
        result = previousOperand * currentOperand;
        break;
      case  '/':
        result = previousOperand / currentOperand;
        break;
      case '+':
        result = previousOperand + currentOperand;
        break;
      case  '-':
        result = previousOperand - currentOperand;
        break;
    }
    console.log('result равен ' + result);
    return result;
  };

  const transformToLowPriority = function (array) {
    let previousOperand = '';
    let currentOperand = '';
    let operator = '';
    let operandsAndLowPriorityOperators = [];
    for (let i = 0; i < array.length; i++) {
      if (availableOperators.indexOf(array[i])) { // если текущий элемент является оператором
        if (array[i] === '*' || array[i] === '/') {
          operator = array[i]; // сохраняем оператор для операции * или /
        } else {
          operandsAndLowPriorityOperators.push(previousOperand); // пушим предыдущий операнд в новый массив
          operandsAndLowPriorityOperators.push(array[i]); // пушим оператор в новый массив
          previousOperand = ''; // обнуляем предыдущий операнд для следующей операции
          operator = ''; // очищаем оператор для следующей операции
        }
      } else { // если текущий элемент является операндом
        currentOperand = array[i];
        if (operator) { // если оператор сохранён, вычисляем произведение или разницу
          previousOperand = calculateOperands(previousOperand, operator, currentOperand);
        } else { // если нет сохранённого оператора, то сохраняем текущее значение в предыдущий операнд
          previousOperand = currentOperand;
        }
      }
    }
    console.log('operandsAndLowPriorityOperators равен ' + operandsAndLowPriorityOperators);
    return operandsAndLowPriorityOperators;
  };

  const calculateResult = function (array) {
    let operandsAndLowPriorityOperators = transformToLowPriority(array);
    let currentOperand = '';
    let previousOperand = '';
    let operator = '';
    for (let i = 0; i < operandsAndLowPriorityOperators.length; i++) {
      if (availableOperators.indexOf(array[i])) {
        if (operator) {
          previousOperand = calculateOperands(previousOperand, operator, currentOperand);
        }
        operator = array[i];
      } else {
        if (!operator) {
          previousOperand = array[i];
        } else {
          currentOperand = array[i];
        }
      }
    }
    console.log('previousOperand равен ' + previousOperand);
    return previousOperand;
  };

  const showResult = function (value) {
    const text = "Ваш результат равен ";
    document.querySelector('.result-block').textContent = text + value;
  };

  const calculateInputtedExpression = function () {
    let taskField = document.querySelector('.task-field'); // находим поле для ввода выражения юзером
    const inputtedExpressions = splitToArray(taskField.value); // преобразуем строковое значение поля в массив и сохраняем в переменную
    taskField.value = ''; // очищаем поле для ввода выражения
    console.log('длина первоначального массива' + inputtedExpressions.length);
    try {
      // разбираем массив введенных значений на операторы и операнды и складываем в новый массив
      const parsedMembers = parseExpressions (inputtedExpressions);
      console.log('длина разобранного на члены массива' + parsedMembers.length);
      // вызываем функцию, вычисляющую из массива результат
      const result = calculateResult(parsedMembers);
      // вызываем функцию, отображающюю результат
      showResult(result);
    } catch (e) {
      alert(e.message);
    }
  };

  document.querySelector('.calculate-btn').addEventListener('click', calculateInputtedExpression);
})();
