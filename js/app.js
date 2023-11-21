class CalorieTracker {
  constructor() {
    this._calorieLimit = 1000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayTotalCalories();
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

  _displayCaloriesConsumed() {}

  _render() {
    this._displayTotalCalories();
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

const tracker = new CalorieTracker();

const dinner = new Meal('Dinner', 500);
tracker.addMeal(dinner);

const run = new Workout('Running', 200);
tracker.addWorkout(run);
