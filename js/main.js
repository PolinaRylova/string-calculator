'use strict';
(function () {
  const availableOperators = ['+', '-', '*', '/'];
  const availableOperandSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

  const splitToArray = function (string) {
    return string.split('');
  };

  const isHigherPrecedence = function (item) {
    return (item === '*' || item === '/');
  };

  const isLowerPrecedence = function (item) {
    return (item === '+' || item === '-');
  };

  const areBadNeighbors = function (item, currentIndex, previousIndex) {
    return (isHigherPrecedence(item)) && (currentIndex - previousIndex === 1);
  };

  const parseExpressions = function (array) {
    let parsedArray = [];
    let operand = '';
    let prevIndex;
    for (let i = 0; i < array.length; i++) {
      // проверяем первый введенный символ на соответствие * или /
      if (i === 0 && (isHigherPrecedence(array[i]))) {
        throw new Error('Ошибка ввода. Первыми символами не могут быть "*" и "/".');
      }
      // если введен операнд (число), сохраняем его
      if (availableOperandSymbols.indexOf(array[i]) >= 0) {
        operand += array[i];
        if(operand[0] === '.') {
          operand = '0' + operand;
        }
        if (i === array.length - 1) {
          parsedArray.push(operand);
        }
      } else if (availableOperators.indexOf(array[i]) >= 0) {
        if (i === array.length - 1) {
          throw new Error('Ошибка ввода. В конце выражения не должно быть знаков - только цифры.');
        } else if (areBadNeighbors(array[i], i, prevIndex)) {
          throw new Error('Ошибка ввода. Не поддерживаются сочетания "+*", "-*, "+/", "-/".');
        } else {
          if (isLowerPrecedence(array[i])) {
            prevIndex = i;
          }
          parsedArray.push(operand); // кладем в массив хранящееся в операнде значение
          operand = ''; // очищаем переменную операнда
          parsedArray.push(array[i]); // кладем в массив оператор
        }
      }
    }
    if (parsedArray.length > 0) {
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
        result = Number(previousOperand) + Number(currentOperand);
        break;
      case  '-':
        result = previousOperand - currentOperand;
        break;
    }
    console.log('result равен ' + result);
    return result;
  };

  const transformToLowPrecedence = function (array) {
    let previousOperand = '';
    let currentOperand = '';
    let operator = '';
    let lowPrecedenceExpressions = [];
    for (let i = 0; i < array.length; i++) {
      if (availableOperators.indexOf(array[i]) >= 0) { // если текущий элемент является оператором
        if (operator !== '') { // если оператор не равен пустой строке
          lowPrecedenceExpressions.push(previousOperand); // пушим предыдущий операнд в новый массив
          lowPrecedenceExpressions.push(operator); // пушим предыдущий оператор в новый массив
          previousOperand = currentOperand;
        }
        operator = array[i]; // перезаписываем оператор в любом случае
      } else { // если текущий элемент является операндом (числом)
        if (previousOperand === '') { // если предыдущий операнд равен пустой строке
          previousOperand = array[i];
        } else {
          if (isLowerPrecedence(operator)) { // если оператор + или -
            currentOperand = array[i];
          } else { // если оператор * или /
            previousOperand = calculateOperands(previousOperand, operator, array[i]).toString();
            operator = '';
          }
        }
      }
    }
    lowPrecedenceExpressions.push(previousOperand);
    if (operator !== '') {
      lowPrecedenceExpressions.push(operator);
      lowPrecedenceExpressions.push(currentOperand);
    }
    return lowPrecedenceExpressions;
  };

  const calculateResult = function (array) {
    let lowPrecedenceExpressions = transformToLowPrecedence(array);
    if (lowPrecedenceExpressions.length === 1) {
      return lowPrecedenceExpressions[0];
    }
    let currentOperand = '';
    let previousOperand = '';
    let operator = '';
    for (let i = 0; i < lowPrecedenceExpressions.length; i++) {
      if (availableOperators.indexOf(lowPrecedenceExpressions[i]) >= 0) {
        if (operator) {
          previousOperand = calculateOperands(previousOperand, operator, currentOperand);
        }
        operator = lowPrecedenceExpressions[i];
      } else {
        if (!operator) {
          previousOperand = lowPrecedenceExpressions[i];
        } else {
          currentOperand = lowPrecedenceExpressions[i];
        }
      }
    }
    previousOperand = calculateOperands(previousOperand, operator, currentOperand);
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
    try {
      // разбираем массив введенных значений на операторы и операнды и складываем в новый массив
      const parsedMembers = parseExpressions (inputtedExpressions);
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
