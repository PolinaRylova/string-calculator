'use strict';
(function () {
  const operatorsArray = ['+', '-', '*', '/'];
  let operator;
  let leftOperand = "";
  let rightOperand = "";
  let result;

  const calculateInputedExspression = function () {
    // извлекаем textContent и сохраняем значение в массив
    const inputedExpressionArray = document.querySelector('.task-field').value.split('');
    // парсим массив и записываем в переменные
    inputedExpressionArray.forEach(function(item) {
      if (!operator) {
        if (operatorsArray.indexOf(item) < 0) {
          leftOperand += item;
        } else {
          operator = item;
        }
      } else {
        rightOperand += item;
      }
    });
    // выполняем вычисления над данными из массива
    switch (operator) {
      case '+':
        result = Number(leftOperand) + Number(rightOperand);
        break;
      case '-':
        result = leftOperand - rightOperand;
        break;
      case '*':
        result = leftOperand * rightOperand;
        break;
      case '/':
        result = leftOperand / rightOperand;
        break;
    }
    // вызов функции, которая отображает результат вычислений в resultBlock
    document.querySelector('.result-block').textContent = result;
  };

  document.querySelector('.calculate-btn').addEventListener('click', calculateInputedExspression);
})();
