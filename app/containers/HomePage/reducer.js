/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  TASK_ICON_CLICK,
  TASK_ICON_CLICK_DEFAULT,
  TASK_CHANGE,
  NEW_TASK_CHANGE,
  TASK_SUBMIT,
  TASK_REMOVE,
  FILTER_TASKS,
  CLEAR_COMPLETED,
} from './constants';

export const initialState = fromJS({
  newTask: '',
  itemsLeft: 0,
  itemsCompleted: 0,
  currentFilter: 'all',
  tasks: [],
});

//  Helper
const getItemsCompleted = tasks =>
  tasks.reduce((acc, item) => acc + (item.get('status') === 'done'), 0);

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case TASK_ICON_CLICK: {
      const tasks = state.get('tasks');
      const tasksUpdated = tasks.update(
        tasks.findIndex(item => item.get('id') === action.tid),
        item =>
          item.set(
            'status',
            item.get('status') === 'pending' ? 'done' : 'pending',
          ),
      );
      const itemsCompleted = getItemsCompleted(tasksUpdated);
      const itemsLeft = tasksUpdated.count() - itemsCompleted;

      return state
        .set('itemsLeft', itemsLeft)
        .set('itemsCompleted', itemsCompleted)
        .set('tasks', tasksUpdated);
    }
    case TASK_ICON_CLICK_DEFAULT: {
      const tasks = state.get('tasks');
      const isAllTasksDone = getItemsCompleted(tasks) === tasks.count();

      return state
        .set('itemsLeft', isAllTasksDone ? tasks.count() : 0)
        .set('itemsCompleted', isAllTasksDone ? 0 : tasks.count())
        .set(
          'tasks',
          tasks.map(
            item =>
              isAllTasksDone
                ? item.set('status', 'pending')
                : item.set('status', 'done'),
          ),
        );
    }
    case TASK_CHANGE: {
      const tasks = state.get('tasks');

      return state.set(
        'tasks',
        tasks.update(
          tasks.findIndex(item => item.get('id') === action.tid),
          item => item.set('task', action.value),
        ),
      );
    }
    case NEW_TASK_CHANGE: {
      return state.set('newTask', action.value);
    }
    case TASK_SUBMIT: {
      const event = action.evt;
      const task = event.target.elements.task.value;

      // Esto no lo entendí
      event.preventDefault();
      // Esto no lo entendí
      event.stopPropagation();

      const tasks = state.get('tasks').push(
        fromJS({
          id: Date.now(),
          status: 'pending',
          task,
        }),
      );

      const itemsCompleted = getItemsCompleted(tasks);
      const itemsLeft = tasks.count() - itemsCompleted;

      return state
        .set('newTask', '')
        .set('itemsLeft', itemsLeft)
        .set('itemsCompleted', itemsCompleted)
        .set('tasks', tasks);
    }
    case TASK_REMOVE: {
      const tasks = state.get('tasks');
      const tasksUpdated = tasks.delete(
        tasks.findIndex(item => item.get('id') === action.tid),
      );
      const itemsCompleted = getItemsCompleted(tasksUpdated);
      const itemsLeft = tasksUpdated.count() - itemsCompleted;

      return state
        .set('itemsLeft', itemsLeft)
        .set('itemsCompleted', itemsCompleted)
        .set('tasks', tasksUpdated);
    }

    case FILTER_TASKS: {
      return state.set('currentFilter', action.filter);
    }
    case CLEAR_COMPLETED: {
      const tasks = state.get('tasks');
      return state.set('tasks', tasks.filter(t => t.get('status') !== 'done'));
    }
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default homePageReducer;
