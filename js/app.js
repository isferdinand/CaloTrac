class CalorieTracker {
  constructor() {
    this._calorieLimit = 1000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayTotalCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  //   Public Methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
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
  constructor(type, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.type = type;
    this.calories = calories;
  }
}

// Handle Events for adding new meal and workouts from the page
class App {
  //instantiate a tracker set it to property in the constructor
  constructor() {
    this._tracker = new CalorieTracker();

    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newMeal.bind(this));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newWorkout.bind(this));
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
    this._tracker.addMeal(workout);

    //Clear the form
    workoutName.value = '';
    workoutCalorie.value = '';

    const collapseWorkout = document.getElementById('collapse-workout');
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

// const tracker = new CalorieTracker();

// const dinner = new Meal('Dinner', 300);
// tracker.addMeal(dinner);
// const lunch = new Meal('Lunch', 300);
// tracker.addMeal(lunch);

// const run = new Workout('Running', 500);
// tracker.addWorkout(run);
