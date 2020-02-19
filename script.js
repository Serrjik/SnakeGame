// В этом файле основная программа.

// Количество строк игровой карты.
const ROWS = 10
// Количество колонок игровой карты.
const COLUMNS = 10
// Стартовое время, которое должно пройти между соседними итерациями игры.
const START_COOLDOWN = 400
/*
	Сколько времени отнимать от времени между
	соседними итерациями игры при наборе еды.
*/
const LEVEL_COOLDOWN = 20

// Размер ячейки.
const CELL_SIZE = 50
// Расстояние между ячейками.
const CELL_MARGIN = 3
// Внутренние отступы канваса.
const GAME_PADDING = 10

// Цвет ячейки с едой. (Apple green)
const FOOD_COLOR = '#8db600'
// Цвет ячейки с плохой едой. (Apple Red)
const BAD_FOOD_COLOR = '#981815'
// Цвет змейки. (Eden)
const SNAKE_COLOR = '#264e36'
// Цвет пустых ячеек.
const FREE_COLOR = 'rgb(240, 240, 240)'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// Размеры канваса.
canvas.width = CELL_SIZE * COLUMNS + (COLUMNS - 1) * CELL_MARGIN + 2 * GAME_PADDING
canvas.height = CELL_SIZE * ROWS + (ROWS - 1) * CELL_MARGIN + 2 * GAME_PADDING

let map = createGameMap(COLUMNS, ROWS)

// Положить еду в случайную свободную ячейку.
getRandomFreeCell(map).food = true
// Положить плохую еду в случайную свободную ячейку.
getRandomFreeCell(map).badFood = true
// Поместить змейку в случайную свободную ячейку.
// getRandomFreeCell(map).snake = true

// Змейка. Массив с элементами поля, где находится змейка.
const cell = getRandomFreeCell(map)
let snake = [cell]

cell.snake = true

// const snake = [getRandomFreeCell(map)]
// snake[0].snake = true

let snakeDirect = 'up'
let nextSnakeDirect = 'up'

/*
	Зарегистрировать вызов переданной функции
	перед моментом обновления монитора.
*/
requestAnimationFrame(loop)

// Время существования игры с момента последнего обновления монитора.
let prevTick = 0
// Должна ли продолжаться игра?
let play = true
let cooldown = START_COOLDOWN

// timestamp - время существования страницы.
function loop (timestamp) {
	requestAnimationFrame(loop)

	clearCanvas()

	// Если между соседними итерациями игры прошло и игра должна продолжаться:
	if (prevTick + cooldown <= timestamp && play) {
		/*
			Время существования игры с момента последнего обновления монитора
			сделать равным времени существования страницы.
		*/
		prevTick = timestamp

		// Заменим направление движения змейки на следующее перед передвижением.
		snakeDirect = nextSnakeDirect
		// Передвинуть змейку.
		moveSnake()

		// Голова змейки.
		const head = snake[0]
		// Хвост змейки.
		const tail = snake[snake.length - 1]

		// Находится ли голова змейки в ячейке с едой?
		if (head.food) {
			// Убрать еду из ячейки.
			head.food = false

			/*
				Удлинить змейку с хвоста на 1 ячейку (добавить к хвосту
				ту же ячейку). Змейка удлинится в следующей итерации.
			*/
			snake.push(tail)

			// Положить еду в новую свободную ячейку.
			getRandomFreeCell(map).food = true
			// Уменьшить время между итерациями.
			cooldown -= LEVEL_COOLDOWN
		}

		else {
			// Конец игры?
			let isEnd = false

			// Находится ли голова змейки в ячейке с плохой едой?
			if (head.badFood) {
				// Убрать плохую еду из ячейки.
				head.badFood = false

				/*
					Уменьшить змейку.
				*/
				snake.pop()

				if (snake.length !== 0) {
					// Положить плохую еду в случайную свободную ячейку.
					getRandomFreeCell(map).badFood = true
					// Уменьшить время между итерациями.
					// cooldown -= LEVEL_COOLDOWN
				}

				else {
					// Конец игры.
					isEnd = true
				}
			}

			// Пройти по всем элементам змейки кроме головы.
			for (let i = 1; i < snake.length; i++) {
				// Если какая-то часть змейки окажется там же, где и голова.
				if (snake[i] === snake[0]) {
					// Конец игры.
					isEnd = true
					break
				}
			}

			// Если настал конец игры:
			if (isEnd) {
				// alert('Конец игры!')
				// Игра не должна продолжаться.
				play = false
			}
		}
	}

	// Отрисовать карту игры.
	drawGameMap(map)
	showState()

	// Если игра не продолжается (пауза):
	if (!play) {
		drawPaused()
	}
}

// Повесить обработчик события нажатия клавиши на страницу.
document.addEventListener("keydown", function (event) {
	if (event.key === "ArrowUp") {
		// Если змейка состоит всего из 1 ячейки:
		if (snake.length === 1 || snakeDirect === "left" || snakeDirect === "right") {
			nextSnakeDirect = "up"
		}
	}

	else if (event.key === "ArrowDown") {
		// Если змейка состоит всего из 1 ячейки:
		if (snake.length === 1 || snakeDirect === "left" || snakeDirect === "right") {
			nextSnakeDirect = "down"
		}
	}

	else if (event.key === "ArrowLeft") {
		// Если змейка состоит всего из 1 ячейки:
		if (snake.length === 1 || snakeDirect === "up" || snakeDirect === "down") {
			nextSnakeDirect = "left"
		}
	}

	else if (event.key === "ArrowRight") {
		// Если змейка состоит всего из 1 ячейки:
		if (snake.length === 1 || snakeDirect === "up" || snakeDirect === "down") {
			nextSnakeDirect = "right"
		}
	}

	else if (event.key === 'Enter') {
		// Если игра продолжается:
		if (play) {
			return
		}

		init()
	}
})