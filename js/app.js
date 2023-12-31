class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayTotalCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    //show limit after adding in storage
    document.getElementById('limit').value = this._calorieLimit;
  }

  //   Public Methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    // get meal index to remove
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this.workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  // load both meals and workouts
  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  //  Private Methods
  _displayTotalCalories() {
    const totalCaloriesEl = document.getElementById('calories-total');
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const CaloriesLimitEl = document.getElementById('calories-limit');
    CaloriesLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');

    const consumed = this._meals.reduce(function (total, eachMeal) {
      return total + eachMeal.calories;
    }, 0);

    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');

    const burnt = this._workouts.reduce(function (total, workout) {
      return total + workout.calories;
    }, 0);

    caloriesBurnedEl.innerHTML = burnt;
  }

  //calories remaining to reach limit set
  _displayCaloriesRemaining() {
    const progressEl = document.getElementById('calorie-progress');
    const caloriesRemainingEl = document.getElementById('calories-remaining');

    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingEl.innerHTML = remaining;

    if (remaining < 0) {
      const toggler = caloriesRemainingEl.parentElement.parentElement;
      toggler.classList.remove('bg-light');
      toggler.classList.add('bg-danger');
      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      const toggler = caloriesRemainingEl.parentElement.parentElement;
      toggler.classList.remove('bg-danger');
      toggler.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById('calorie-progress');
    const progressPercent = (this._totalCalories / this._calorieLimit) * 100;

    //Get the width of progress bar
    const width = Math.min(progressPercent, 100);
    progressEl.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElem = document.getElementById('meal-items');
    const mealElem = document.createElement('div');
    mealElem.classList.add('card', 'my-2');
    mealElem.setAttribute('data-id', meal.id);
    mealElem.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                  ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
          </button>
      </div>
    </div>`;
    mealsElem.appendChild(mealElem);
  }

  _displayNewWorkout(workout) {
    const workoutsElem = document.getElementById('workout-items');
    const workoutElem = document.createElement('div');
    workoutElem.classList.add('card', 'my-2');
    workoutElem.setAttribute('data-id', workout.id);
    workoutElem.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                  ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
          </button>
      </div>
    </div>`;
    workoutsElem.appendChild(workoutElem);
  }

  //Show the output of markup and code to the user in the browser
  _render() {
    this._displayTotalCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

//the methods are going to be static
class Storage {
  static getCalorieLimit(defaultCalorieLimit = 1800) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultCalorieLimit;
    } else {
      calorieLimit = Number(localStorage.getItem('calorieLimit'));
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totaCalories ') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = Number(localStorage.getItem('totalCalories'));
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });

    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    // localStorage.clear
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');
  }
}

// Handle Events for adding new meal and workouts from the page
class App {
  //instantiate a tracker set it to property in the constructor
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newMeal.bind(this));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newWorkout.bind(this));

    // remove item using event delegation(target the parent class of all items)
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();

    const mealName = document.getElementById('meal-name');
    const mealCalorie = document.getElementById('meal-calories');

    // Validating inputs
    if (mealName.value === '' || mealCalorie.value === '') {
      alert('Please fill in the fields');
      return;
    }

    const meal = new Meal(mealName.value, Number(mealCalorie.value));
    this._tracker.addMeal(meal);

    //Clear the form
    mealName.value = '';
    mealCalorie.value = '';

    const collapseMeal = document.getElementById('collapse-meal');
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const workoutName = document.getElementById('workout-name');
    const workoutCalorie = document.getElementById('workout-calories');

    // Validating inputs
    if (workoutName.value === '' || workoutCalorie.value === '') {
      alert('Please fill in the fields');
      return;
    }

    const workout = new Workout(
      workoutName.value,
      Number(workoutCalorie.value)
    );
    this._tracker.addWorkout(workout);

    //Clear the form
    workoutName.value = '';
    workoutCalorie.value = '';

    const collapseWorkout = document.getElementById('collapse-workout');
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are your sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout();

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a Limit');
      return;
    }

    this._tracker.setLimit(Number(limit.value));
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();

// const tracker = new CalorieTracker();

// const dinner = new Meal('Dinner', 300);
// tracker.addMeal(dinner);
// const lunch = new Meal('Lunch', 300);
// tracker.addMeal(lunch);

// const run = new Workout('Running', 500);
// tracker.addWorkout(run);
