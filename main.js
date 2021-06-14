(() => {
	// const MAX__RANDOM_NUMBER = 8;
	const modalOverlay = document.querySelector('.modal-overlay');
	const modal = document.querySelector('.modal');
	const form = document.getElementById('welcome_form');
	const gameField = document.querySelector('.game_field');
	const rows = document.getElementById('rows');
	const columns = document.getElementById('columns');
	const conditions = document.getElementById('conditions');

	form.addEventListener('submit', event => {
		event.preventDefault();
		const timerField = document.createElement('div');
		conditions.after(timerField);
		let timeToGameOver = 60; //ms
		timerField.textContent = `Секунд до окончания партии: ${timeToGameOver}! Поторопись!`;
		let gameOver = setInterval(() => {
			if (timeToGameOver > 0) {
				timerField.textContent = `Секунд до окончания партии: ${--timeToGameOver}! Поторопись!`;
			} else {
				alert('Ты проиграл!\nПосле закрытия этого окна, игра вернётся на Главную страницу.');
				location.reload();
			};
		}, 1000);
		modalOverlay.classList.add('modal-overlay--invisible');
		modal.classList.add('modal--invisible');
		conditions.innerHTML = `Текущая партия: <br>Количество рядов:<b>${rows.value}</b><br>Количество колонок:<b>${columns.value}</b>`;
		const desk = document.createElement('table');
		desk.id = 'desk';
		gameField.append(desk);

		// Перетасованный массив с числами от 1 до 8
		let randomNumbers = getRandomNumbers(rows.value, columns.value);

		// Номер карты (для присвоения числа)
		let i = 0;

		for (let rowNumber = 1; rowNumber <= rows.value; rowNumber++) {
			let rowOfElements = document.createElement('tr');
			rowOfElements.style.height = `(100 / ${rows.value})%`;
			desk.append(rowOfElements);
			for (let cardInRowNumber = 1; cardInRowNumber <= columns.value; cardInRowNumber++) {
				let scene = document.createElement('td');
				let card = document.createElement('div');
				let front = document.createElement('div');
				let back = document.createElement('div');
				scene.style.width = `(100 / ${columns.value})%`;
				scene.classList.add('scene');
				rowOfElements.append(scene);
				card.classList.add('card');
				scene.append(card);
				front.classList.add('card__face');
				front.classList.add('card__face--front');
				back.classList.add('card__face');
				back.classList.add('card__face--back');

				back.textContent = randomNumbers[i];

				card.append(front);
				card.append(back);
				i++;
			}
		}
		let clickCounter = 0;
		let first_card_value = true;
		let second_card_value = false;
		let first_card, second_card;
		desk.addEventListener('click', (event) => {
			clickCounter++;
			
			switch (clickCounter) {
				case 1:
					if (first_card != undefined) {
						if (first_card_value != second_card_value){
							first_card.classList.remove('is-flipped');
							first_card.setAttribute('style', 'pointer-events: auto;');
							second_card.classList.remove('is-flipped');
							second_card.setAttribute('style', 'pointer-events: auto;');
						}
					}
					first_card = event.target.parentElement;
					first_card.classList.add('is-flipped');
					first_card.setAttribute('style', 'pointer-events: none;');
					first_card_value = (event.target.nextSibling != null) ? event.target.nextSibling.textContent : true;
					break;
				default:
					clickCounter = 0;
					if (event.target.parentElement.classList.contains('is-flipped')) {
						event.target.parentElement.classList.remove('is-flipped');
						console.log('you clicked one card 2 times');
						break;
					}
					second_card = event.target.parentElement;
					second_card.classList.add('is-flipped');
					second_card.setAttribute('style', 'pointer-events: none;');
					second_card_value = (event.target.nextSibling != null) ? event.target.nextSibling.textContent : false;
					if (didYouWin(desk)) {
						alert("Ты выиграл!\nПосле закрытия этого окна, игра вернётся на Главную страницу.");
						location.reload();
					}
					break;
			}
		});
	});

	/**
	 * Функция проверяет, нашёл ли игрок все пары карт
	 * @param {string} desk таблица с картами
	 * @returns выиграл ли игрок?
	 */
	function didYouWin(desk) {
		for (let i = 0; i < rows.value; i++) {
			console.log('i: '+i);
			for (let j = 0; j < columns.value; j++) {
				if (!desk.children[i].children[j].firstChild.classList.contains('is-flipped')) {
					console.log('j: '+j);
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Функция создаёт массив случайных чисел и перетасовывает его
	 * @param {number} rows количество рядов
	 * @param {number} columns количество колонок
	 * @returns массив чисел, отсортированный по методу Фишера-Йетса
	 */
	function getRandomNumbers(rows, columns) {
		let array = [];
		for (i = 1; i <= (rows*columns/2); i++) {
			x = Math.ceil(Math.random() * (rows * columns) / 2);
			array.push(x);
			array.push(x);
		}
		let fy_array = [];
		while (array.length > 0) {
			n = array.length;
			i = Math.round(Math.random()*(n-1));
			number = array.splice(i, 1);
			fy_array.push(number[0]);
		}
		return fy_array;
	}
})();