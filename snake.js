// В этом файле функции, которые использует программа.

/*
	Функция отрисовывает прямоугольник.
	Принимает объект с параметрами для отрисовки
	(Координаты левого верхнего угла,
	ширина и высота прямоугольника, цвет заливки).
*/
function drawRect (param) {
	// Новая геометрическая фигура.
	context.beginPath()
	// Обозначить прямоугольник.
	context.rect(param.x, param.y, param.width, param.height)
	context.fillStyle = param.fillColor
	context.fill()
}

// Функция очищает канвас.
function clearCanvas () {
	// Очистить канвас - короткая запись.
	// canvas.width = canvas.width

	// Очистить канвас по канону, как предусмотрено в JS.
	context.clearRect(0, 0, canvas.width, canvas.height)
}

// Функция создаёт игровое поле. Принимает количество колонок и строк.
function createGameMap (columns, rows) {
	// Карта игрового поля.
	const map = []

	// Заполнить карту игрового поля.
	for (let x = 0; x < columns; x++) {
		const row = []

		for (let y = 0; y < rows; y++) {
			row.push({
				x: x,
				y: y,
				// Есть ли змейка?
				snake: false,
				// Есть ли еда?
				food: false,
				// Есть ли плохая еда?
				badFood: false
			})
		}

		map.push(row)
	}

	return map
}

// Функция возвращает случайную свободную от змейки и еды ячейку.
function getRandomFreeCell (map) {
	// Все свободные ячейки.
	const freeCells = []

	/*
		map.flat() делает массив плоским (убирает 1 уровень вложенности).
		[[1, 2, 3], [4, 5, 6]].flat() -> [1, 2, 3, 4, 5, 6]
		Если передать параметр Infinity (уберет все уровни вложенности):
		[[['a', 'b', 'c'], 1, 2, 3], [4, 5, 6]].flat(Infinity) -> ["a", "b", "c", 1, 2, 3, 4, 5, 6]
	*/
	// Пройти по всем ячейкам на карте.
	for (const cell of map.flat()) {
		// Если ячейка НЕ пустая:
		if (cell.snake || cell.food) {
			// Такая ячейка НЕ подходит, перейти к следующей.
			continue
		}

		// Пустую ячейку положить в массив свободных ячеек.
		freeCells.push(cell)
	}

	// Случайный индекс среди всех индексов массива свободных ячеек.
	const index = Math.floor(Math.random() * freeCells.length)
	// Вернуть случайную свободную ячейку.
	return freeCells[index]
}

// Функция отрисовывает карту.
function drawGameMap (map) {
	// Пройти по всем ячейкам.
	for (const cell of map.flat()) {
		const param = {
			// Координаты левого верхнего угла.
			x: GAME_PADDING + cell.x * (CELL_SIZE + CELL_MARGIN),
			y: GAME_PADDING + cell.y * (CELL_SIZE + CELL_MARGIN),
			// Ширина и высота прямоугольника.
			width: CELL_SIZE,
			height: CELL_SIZE,
			// Цвет заливки.
			fillColor: FREE_COLOR
		}

		// Если ячейка с едой:
		if (cell.food) {
			param.fillColor = FOOD_COLOR
		}

		// Если ячейка с плохой едой:
		if (cell.badFood) {
			param.fillColor = BAD_FOOD_COLOR
		}

		// Если в ячейке змейка:
		if (cell.snake) {
			param.fillColor = SNAKE_COLOR
		}

		// Отрисовать выбранную ячейку.
		drawRect(param)
	}
}

// Функция возвращает ячейку карты по координатам x, y.
function getCell (x, y) {
	// Если вышли за левую границу поля:
	if (x < 0) {
		// Вернуться с правой стороны поля.
		x += COLUMNS
	}

	// Если вышли за правую границу поля:
	if (x >= COLUMNS) {
		// Вернуться с левой стороны поля.
		x -= COLUMNS
	}

	// Если вышли за верхнюю границу поля:
	if (y < 0) {
		// Вернуться с нижней стороны поля.
		y += ROWS
	}

	// Если вышли за нижнюю границу поля:
	if (y >= ROWS) {
		// Вернуться с верхней стороны поля.
		y -= ROWS
	}

	// Пройти по всем ячейкам карты map.
	for (const cell of map.flat()) {
		// Если ячейка совпадает с искомой.
		if (cell.x === x && cell.y === y) {
			// Вернуть ячейку.
			return cell
		}
	}
}

// Функция передвигает змейку.
function moveSnake () {
	// Пройти по всем ячейкам змейки кроме головы.
	for (let i = snake.length - 1; i > 0; i--) {
		/*
			Заменим предыдущую ячейку на следующую по движению змейки 
			(следующая станет там, где раньше была предыдущая).
		*/
		snake[i] = snake[i - 1]
	}

	// Если змейка двигается влево:
	if (snakeDirect === 'left') {
		// Взять левую ячейку от головы змейки и установить новую голову змейки.
		snake[0] = getCell(snake[0].x - 1, snake[0].y)
	}

	// Если змейка двигается вправо:
	else if (snakeDirect === 'right') {
		// Взять правую ячейку от головы змейки и установить новую голову змейки.
		snake[0] = getCell(snake[0].x + 1, snake[0].y)
	}

	// Если змейка двигается вверх:
	else if (snakeDirect === 'up') {
		// Взять верхнюю ячейку от головы змейки и установить новую голову змейки.
		snake[0] = getCell(snake[0].x, snake[0].y - 1)
	}

	// Если змейка двигается вниз:
	else if (snakeDirect === 'down') {
		// Взять нижнюю ячейку от головы змейки и установить новую голову змейки.
		snake[0] = getCell(snake[0].x, snake[0].y + 1)
	}

	// Пройти по всем ячейкам на карте.
	for (const cell of map.flat()) {
		// Отметить все ячейки как ячейки без змейки.
		cell.snake = false
	}

	// Пройти по всем ячейкам змейки.
	for (const cell of snake) {
		// Отметить эти ячейки как ячейки со змейкой.
		cell.snake = true
	}
}

// Функция выводит информацию о состоянии игры.
function showState () {
	context.fillStyle = 'black'
	context.font = "20px sans-serif"
	context.textAlign = "left"
	context.fillText(`Cooldown: ${cooldown}`, 10, 30)
	context.fillText(`Очки: ${snake.length * 5}`, 10, 50)
}

// Функция показывает сообщение на канвасе во время игровой паузы.
function drawPaused () {
	context.beginPath()
	context.rect(0, 0, canvas.width, canvas.height)
	context.fillStyle = 'rgba(255, 255, 255, 0.7)'
	context.fill()

	context.font = "50px sans-serif"
	context.fillStyle = 'black'
	context.textAlign = "center"
	context.fillText(`Ваш счет: ${snake.length * 5}`, canvas.width / 2, canvas.height / 2)

	context.font = "30px sans-serif"
	context.fillText("Нажмите Enter чтобы продолжить", canvas.width / 2, canvas.height / 2 + 50)
}

// Функция инициализирует игру.
function init () {
	map = createGameMap(COLUMNS, ROWS)

	const cell = getRandomFreeCell(map)

	snake = [cell]

	cell.snake = true

	snakeDirect = 'up'
	nextSnakeDirect = 'up'
	play = true
	cooldown = START_COOLDOWN

	// Положить еду в случайную свободную ячейку.
	getRandomFreeCell(map).food = true
	// Положить плохую еду в случайную свободную ячейку.
	getRandomFreeCell(map).badFood = true
}