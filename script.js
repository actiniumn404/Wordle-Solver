function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

const delete_item = (arr, item) => {
	res = [];
	for (thing of arr) {
		if (item !== thing) {
			res.push(thing);
		}
	}
	return res;
};

for (let i = 0; i < 6; i++) {
	let row = document.createElement("TR");
	for (let j = 0; j < 5; j++) {
		let input = document.createElement("INPUT");
		input.classList.add("wordle_input");
		input.classList.add("black");
		input.id = "w_input_" + (i * 5 + j + 1 < 10 ? "0" : "") + (i * 5 + j + 1);
		input.setAttribute("maxlength", "1");
		let el = document.createElement("TD");
		el.appendChild(input);
		row.appendChild(el);
	}
	document.getElementById("gui").appendChild(row);
	row = document.createElement("TR");
	for (let j = 0; j < 5; j++) {
		let input = document.createElement("SELECT");
		input.id = "w_select_" + (i * 5 + j + 1 < 10 ? "0" : "") + (i * 5 + j + 1);
		input.classList.add("wordle_select");
		// Part 1
		option = document.createElement("OPTION");
		option.value = "black";
		option.innerHTML = "Black";
		input.appendChild(option);
		// Part 2
		option = document.createElement("OPTION");
		option.value = "yellow";
		option.innerHTML = "Yellow";
		input.appendChild(option);
		// Part 3
		option = document.createElement("OPTION");
		option.value = "green";
		option.innerHTML = "Green";
		input.appendChild(option);
		// End
		el = document.createElement("TD");
		el.appendChild(input);
		row.appendChild(el);
	}
	document.getElementById("gui").appendChild(row);
}

$(".wordle_input").keyup((e) => {
	let el = e.target;
	let el_id = Number(el.id.slice(-2));
	if (e.key === "Backspace") {
		$("#w_input_" + (el_id - 1 < 10 ? "0" : "") + (el_id - 1)).select();
	} else if (isLetter($(el).val())) {
		$("#w_input_" + (el_id + 1 < 10 ? "0" : "") + (el_id + 1)).select();
	}
});

$(".wordle_select").change((e) => {
	let el = e.target;
	let el_id = Number(el.id.slice(-2));
	$("#w_input_" + (el_id < 10 ? "0" : "") + el_id).css(
		"background",
		`var(--${el.value})`
	);
	$("#w_input_" + (el_id < 10 ? "0" : "") + el_id).removeClass("green");
	$("#w_input_" + (el_id < 10 ? "0" : "") + el_id).removeClass("yellow");
	$("#w_input_" + (el_id < 10 ? "0" : "") + el_id).removeClass("black");
	$("#w_input_" + (el_id < 10 ? "0" : "") + el_id).addClass(el.value);
});

$("#solve").click(() => {
	// === SETUP ===
	turn = $("#guessnum input").val();
	if (!turn) {
		alert("What guess are you on?");
		return;
	}

	if (!(1 <= Number(turn) && Number(turn) <= 6)) {
		alert("You cannot be on guess " + Number(turn));
		return;
	}
	black = [];
	yellow = {};
	y_list = [];
	green = {};
	g_list = [];
	for (let i = 1; i < Number(turn) * 5 + 1; i++) {
		el = $("#w_input_" + (i < 10 ? "0" : "") + i);
		el_val = el.val();
		if (!isLetter(el_val)) {
			alert("Row " + (Math.floor(i / 5) + 1) + " is incomplete");
			return;
		}
		if (el.hasClass("black")) {
			black.push(el_val);
		} else if (el.hasClass("yellow")) {
			yellow[el_val] = (i - 1) % 5;
			y_list.push(el_val);
		} else if (el.hasClass("green")) {
			green[el_val] = (i - 1) % 5;
			g_list.push(el_val);
		}
	}
	new_black = black;
	for (item of black) {
		if (y_list.includes(item) || g_list.includes(item)) {
			new_black = delete_item(new_black, item);
		}
	}
	black = new_black;

	// === FILTER PART ONE: BLACK SQUARES ===
	let result = [];
	for (word of words) {
		found = true;
		for (letter of word.split("")) {
			if (black.includes(letter)) {
				found = false;
				break;
			}
		}
		if (found) {
			result.push(word);
		}
	}
	// === FILTER PART TWO: GREEN SQUARES ===
	let result2 = [];
	for (word of result) {
		found = true;
		for (test_case in green) {
			if (word[green[test_case]] != test_case) {
				found = false;
				break;
			}
		}
		if (found) {
			result2.push(word);
		}
	}
	// === FILTER PART THREE: YELLOW SQUARES ===
	result = [];
	for (word of result2) {
		found = true;
		for (test_case in yellow) {
			if (!word.includes(test_case) || word[yellow[test_case]] === test_case) {
				found = false;
				break;
			}
		}
		if (found) {
			result.push(word);
		}
	}
	result.sort();
	$("#results").html(
		`<span style="display: inline-block;width: 100%;margin: 20px;">${result.length} results were found!</span>`
	);
	for (res of result) {
		$("#results").append(`<div class="res">${res}</div>`);
	}
	if (result.length === 1) {
		conf();
	}
});

function conf() {
	confetti(); // skipcq: JS-0125
	//confetti.reset(); // skipcq: JS-0125
	const duration = 1000;
	const animationEnd = Date.now() + duration;
	const defaults = {
		startVelocity: 50,
		spread: 1000,
		ticks: 1000,
		zIndex: 0,
	};

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(function () {
		let timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 200 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(
			Object.assign({}, defaults, {
				// skipcq: JS-0125
				particleCount,
				origin: {
					x: randomInRange(0.1, 0.3),
					y: Math.random() - 0.2,
				},
			})
		);
		confetti(
			Object.assign({}, defaults, {
				// skipcq: JS-0125
				particleCount,
				origin: {
					x: randomInRange(0.7, 0.9),
					y: Math.random() - 0.2,
				},
			})
		);
	}, 250);
}
