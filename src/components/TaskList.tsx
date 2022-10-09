import { KeyboardEvent } from 'electron';
import React, { useEffect, ChangeEvent, useState } from 'react';
import Task from './Task';
import { SessionInterface, Tasks } from '../entities';
import { writeSessionToPomoHubData, readPomoHubData } from '../App';
import PomoSessionHandler from '../backend/session';


function TaskList() {
  const [task, setTask] = useState<string>('');
  const [todoList, setTodoList] = useState<Tasks[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'task') {
      console.log(event);
      setTask(event.target.value);
    }
  };

  const addTask = (): void => {
    const currDate = new Date();
    const newTask = {
      taskName: task,
      taskId: Math.floor(Math.random() * 199000),
      taskState: 'incomplete',
      dateChanged: currDate
    };
    setTodoList([...todoList, newTask]);
    setTask(''); // clear inputs
    const currSession: SessionInterface = readPomoHubData().storedSessions[-1];
    const sessionHandler = new PomoSessionHandler(currSession);
    // const updatedSession = sessionHandler.cycleModify(newTask);
    // writeSessionToPomoHubData(updatedSession);
  };

  const handleEnter = (task, event: KeyboardEvent): void => {
    if ((event.target.name === 'task') & (event.key === 'Enter')) {
      addTask(task);
    }
  };

  const completeTask = (taskIdToComplete: number): void => {
    // send task to storage
    console.log(`Task completed: ${taskIdToComplete}`);
    const taskIndex = todoList.findIndex((currTasks) => {
      return currTasks.taskId === taskIdToComplete;
    });
    todoList[taskIndex].dateChanged = new Date();
    todoList[taskIndex].taskState = 'complete';
    setTodoList(
      todoList.filter((tasks) => {
        return tasks.taskId !== taskIdToComplete;
      })
    );
    const currSession: SessionInterface = readPomoHubData().storedSessions[-1];
    const sessionHandler = new PomoSessionHandler(currSession);
    const finishedTask = todoList.filter((tasks) => tasks.taskId === taskIdToComplete);
    const updatedSession = sessionHandler.cycleModify(finishedTask[0]);
    writeSessionToPomoHubData(updatedSession);
  };

  const deleteTask = (taskIdToDelete: number): void => {
    setTodoList(
      todoList.filter((task) => {
        return task.taskId !== taskIdToDelete;
      })
    );

    const currSession: SessionInterface = readPomoHubData().storedSessions[-1];
    const sessionHandler = new PomoSessionHandler(currSession);
    const taskToDelete = todoList.filter((tasks) => tasks.taskId === taskIdToDelete)[0];
    const deletedTask = taskToDelete;
    deletedTask.taskState = 'deleted';
    const updatedSession = sessionHandler.cycleModify(deletedTask);
    writeSessionToPomoHubData(updatedSession);
  };

  return (
    <div className="flex flex-col w-full lg:w-[440px] gap-3 text-white font-medium">
      <span className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="inline w-8 h-8 pb-1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <h1 className="text-2xl inline text-white pl-1">Tasks</h1>
      </span>
      {todoList.map((task: Tasks, key: number) => {
        return <Task key={key} task={task} completeTask={completeTask} deleteTask={deleteTask} />;
      })}
      <div className="bg-transparent p-2 rounded-md text-center hover:opacity-60 border-2 border-zinc-700">
        <input
          className="bg-transparent outline-none"
          name="task"
          placeholder="Task Name"
          value={task}
          onChange={handleChange}
          onKeyDown={(event) => handleEnter(task, event)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="inline w-6 h-6 pr-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}

export default TaskList;
function taskState(arg0: number, taskState: any, arg2: string) {
  throw new Error('Function not implemented.');
}

