/** Программа простого калькулятора, создающая из строки массив, разбирающая его и вычисляющая результат выражения.
 * Поддерживает плавающую точку. Не поддерживает отрицательные числа и символы '(',')' для расставления приоритета операций.
 * @author Полина Рылова Junior Frontend Developer (декабрь 2017)
 */
'use strict';
(function () {
  /** Массив доступных для обработки символов операторов
   */
  const availableOperators = ['+', '-', '*', '/'];
  /** Массив доступных для обработки символов операндов
   */
  const availableOperandSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

  /** Создает массив из переданной в параметре строки
   * @param {string} string - Строка, введенная юзером в поле ввода.
   * @return {Array<string>} Возвращает массив элементов, выбранных посимвольно из строки методом split('').
   */
  const splitToArray = function (string) {
    return string.split('');
  };
  /** Проверяет, соответствует ли переданный в параметре элемент массива значениям '*' или '/'.
   * @param {string} item - Элемент массива (оператор).
   * @return {boolean} Возвращает true, если переданный элемент соответствует '*' или '/'. Иначе - false.
   */
  const isHigherPrecedence = function (item) {
    return (item === '*' || item === '/');
  };
  /** Проверяет, соответствует ли переданный в параметре элемент массива значениям '+' или '-'.
   * @param {string} item - Элемент массива (оператор).
   * @return {boolean} Возвращает true, если переданный элемент соответствует '+' или '-'. Иначе - false.
   */
  const isLowerPrecedence = function (item) {
    return (item === '+' || item === '-');
  };
  /** Проверяет наличие в массиве неподдерживаемых сочетаний символов '+*', '+/', '-*', '-/'.
   * @param {string} item - Текущий элемент массива (оператор).
   * @param {number} currentIndex - Индекс текущего элемента массива.
   * @param {number} previousIndex - Последний сохранённый индекс элемента массива, соответствующего '+' или '-'.
   * @return {boolean} Возвращает true, если переданный item соответствует '*' или '/'
   * и следует сразу за элементом, чей индекс был сохранён в previousIndex (то есть за элементом со значением '+' или '-').
   * Иначе - false.
   */
  const areBadNeighbors = function (item, currentIndex, previousIndex) {
    return (isHigherPrecedence(item)) && (currentIndex - previousIndex === 1);
  };
  /** Разбирает массив и записывает операнды отдельно от операторов.
   * @param {Array<string>} array - Массив строк.
   * @return {Array<string>} parsedArray - Возвращает массив строк, которые содержат в себе отдельно операнды и операторы.
   * @throws {Error} Первыми символами не могут быть "*" и "/".
   * Если пользователь ввёл первым символом "*" или "/", то выражение является неподдерживаемым и выбрасывается исключение.
   * @throws {Error} В конце выражения не должно быть знаков - только цифры.
   * Если пользователь ввёл последним символом оператор, то выражение является неподдерживаемым и выбрасывается исключение.
   * @throws {Error} Не поддерживаются сочетания "+*", "-*, "+/", "-/".
   * Если пользователь ввёл подряд сочетание символов "+*", "-*, "+/", "-/", то выражение является неподдерживаемым и выбрасывается исключение.
   * @throws {Error} Пользователь ввёл неподдерживаемый символ или отправил пустую строку.
   * Если пользователь ввёл неподдерживаемый символ или отправил пустую строкy,
   * то массив parsedArray после цикла останется пустым, следовательно выбросится исключение.
   *
   * В переменную operand записываются символы из перебираемого массива,
   * если они соответствуют одному из элементов массива availableOperandSymbols (цифры или точка в строковом представлении).
   * Запись производится методом конкатенации для возможности сохранять многозначные операнды, например '2.25'.
   * Переменная проверяется на наличие первым символом точки (.), тогда она перезаписывается с начальным нулём перед точкой.
   * Если итерация последняя, то кладём последний сохранённый операнд в массив parsedArray (иначе он потеряется).
   *
   * Если символ из перебираемого массива соответствует одному из элементов массива availableOperators ('+','-', '*', '/')
   * и нет ни одной из перечисленных исключений, то сначала кладём в массив parsedArray сохранённый ранее операнд
   * и очищаем переменную, хранившую его значение, чтобы это значение не сконкатенировалось со значением, идущим после оператора
   * (то есть с уже следующим операндом); и затем кладём в массив значение текущего элемента перебираемого массива (оператор).
   *
   * Если символ из перебираемого массива соответствует '+' или '-',
   * то сохраняем его индекс для проверки на неподдерживаемое сочетание символов '+*', '-*', '+/', '-/'.
   *
   * После цикла проверяем длину образованного массива parsedArray.
   * Если он больше нуля, то возвращаем его в место вызова функции parseExpressions, иначе выбрасывается исключение.
   */
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
  /** Вычисляет, в зависимости от переданных операндов и оператора, результат выражения.
   * @param {string} previousOperand - Строковый элемент массива, сохраненный в переменной previousOperand.
   * @param {string} operator - Строковый элемент массива, сохраненный в переменной operator.
   * @param {string} currentOperand - Строковый элемент массива, сохраненный в переменной currentOperand.
   * @return {number} result - Возвращает число - результат операции над операндами по оператору.
   * В кейсе с плюсом (case '+') приводим строковые операнды к числу, чтобы избежать конкатенации, так как нам нужна операция сложения.
   */
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
    return result;
  };
  /** Перебирает элементы переданного в параметре массива, заменяя операции умножения и деления на результат этих операций над соответствующими операндами.
   * Таким образом, в образующемся новом массиве остаются только операнды и операторы одного (низкого по сравнению с '*' и '/') приоритета ('+' и '-').
   * @param {Array<string>} array - Массив строк.
   * @return {Array<string>} lowPrecedenceExpressions - Массив строк.
   *
   * Если текущий элемент цикла соответствует одному из элементов массива availableOperators ('+','-', '*', '/'),
   * то проверяем, есть ли уже сохранённое (а значит, не запушенное в массив lowPrecedenceExpressions) зачение оператора.
   * Если есть, то сначала кладём в массив lowPrecedenceExpressions значение previousOperand,
   * затем operator (предыдущее сохранённое значение оператора), значение, хранящееся currentOperand, перезаписываем в previousOperand
   * и только потом сохраняем значение текущего элемента в оператор.
   * Если же в переменной хранится значение пустой строки (значит, предыдущие операнды и оператор запушены),
   * то сразу записываем в переменную значение текущего элемента.
   *
   * Если текущий элемент цикла НЕ соответствует одному из элементов массива availableOperators, то он является операндом и
   * мы делаем следующие поверки: если переменная previousOperand хранит пустую строку,
   * то сохраняем в неё значение текущего элемента, если же в ней уже хранится предыдущий операнд, то проверяем,
   * что хранится в последнем сохранённом операторе: если '+' или '-', то записываем текущее значение элемента перебираемого массива
   * в переменнную currentOperand, а если '*' или '/', то производим вычисления над previousOperand, operator и текущим значением-операндом.
   * Полученный числовой результат приводим обратно к строке и записываем в previousOperand, а переменную operator очищаем.
   *
   * Если выражение, введенное юзером состояло только из операций '*' и/или '/',
   * то после цикла у нас останется не запушенным в массив lowPrecedenceExpressions
   * последний сохранённый previousOperand. Чтобы не потерять, после цикла мы его пушим.
   * Если же последней операцией было сложение или вычитание, то останутся незапушенными последние previousOperand, operator и currentOperand,
   * поэтому после пуша previousOperand мы проверяем наличие значения в переменной operator, отличного от пустой строки,
   * и если оно есть, то пушим его, а следом значение, хранящееся в currentOperand.
   */
  const transformToLowPrecedence = function (array) {
    let previousOperand = '';
    let currentOperand = '';
    let operator = '';
    let lowPrecedenceExpressions = [];
    for (let i = 0; i < array.length; i++) {
      if (availableOperators.indexOf(array[i]) >= 0) { // если текущий элемент является оператором
        if (operator) { // если оператор не равен пустой строке
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
  /** Принимает массив строк и производит посредством других функций
   * сначала приведение массива с операторами разного приоритета (высокого и низкого)
   * к массиву с операторами одинакового (низкого приоритета),
   * затем разбор на операнды и операторы для вычисления результата операций над ними.
   * @return {number} previousOperand - Число, полученное в результате вычислений.
   * Если возвращаемый массив, сохраненный в переменной lowPrecedenceExpressions,
   * содержит лишь один элемент (в случае ввода юзером выражения с только высокоприоритетными операциями),
   * то функция передает в точку своего вызова данный массив (возвращает единственный элемент массива).
   * Если же возвращаемый массив длиннее, то функция проходит по возвращенному массиву,
   * сохраняя операнды и операторы и производя над ними соответсвующие вычисления посредством другой функции.
   * После цикла остаются неподсчитанными последние значения previousOperand, operator, currentOperand,
   * поэтому мы их передаем в функцию для вычислений результата операции по операнду,
   * и функция возвращает вычисленное значение в точку своего вызова.
   */
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
  /** Отображает в блоке с классом result-block результат выражения, введенного пользователем.
   * @param {string} value - Результат введенного пользователем выражения в виде строки.
   */
  const showResult = function (value) {
    const text = "Ваш результат равен ";
    document.querySelector('.result-block').textContent = text + value;
  };
  /** Вычисляет, в зависимости от переданных операндов и оператора, результат выражения.
   * Находим поле, в которое пользователь должен был ввести выражение.
   * Извлекаем это значение и передаем в виде параметра в функцию, преобразующую строку в массив посимвольно.
   * А значение поля очищаем.
   * Пытаемся передать полученный массив в функцию, разбирающую его на операторы и операнды,
   * затем полученный новый массив в функцию сначала вычисляющую операции с высоким приоритетом ('*', '/'),
   * а затем оставшиеся операции более низкого приоритета ('+' и '-').
   * Полученное значение приводим к строке для единообразия типа параметра,
   * передаваемого в функцию отображения результата пользователю.
   * Если ни на одном этапе не выбрасывается исключение, то программа завершается
   * отображением результата вычислений по введенному выражению в соответствующем блоке.
   * Иначе - программа останавливается и выводит всплывающее предупреждение.
   */
  const calculateInputtedExpression = function () {
    let taskField = document.querySelector('.task-field'); // находим поле для ввода выражения юзером
    const inputtedExpressions = splitToArray(taskField.value); // преобразуем строковое значение поля в массив и сохраняем в переменную
    taskField.value = ''; // очищаем поле для ввода выражения
    try {
      // разбираем массив введенных значений на операторы и операнды и складываем в новый массив
      const parsedMembers = parseExpressions (inputtedExpressions);
      // вызываем функцию, вычисляющую из массива результат и приводим к строке для единообразия типа параметра, передаваемого в функцию showResult
      const result = calculateResult(parsedMembers).toString();
      // вызываем функцию, отображающюю результат
      showResult(result);
    } catch (e) {
      alert(e.message);
    }
  };
  /** Находим кнопку по селектору класса '.calculate-btn' и назначаем ей обработчик события клика,
   * при котором будет вызвана функция для действий над введённым пользователем в поле ввода значением.
   * @param {querySelector<string>} .calculate-btn - Селектор класса, указывающий на элемент DOM-дерева.
   * @param {event<string>} click - Тип события, при котором будет срабатывать функция обратного вызова.
   * @param {function} calculateInputtedExpression - Функция обратного вызова, которая будет срабатывать при клике.
   */
  document.querySelector('.calculate-btn').addEventListener('click', calculateInputtedExpression);
})();
