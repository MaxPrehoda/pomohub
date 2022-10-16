import { KeyboardEvent } from 'electron';
import React, { ChangeEvent, useState } from 'react';
import Task from './Task';
import { SessionInterface, Tasks } from '../entities';
import { writeSessionToPomoHubData, readPomoHubData } from '../App';
import PomoSessionHandler from '../backend/session';

function TaskList() {
  const [task, setTask] = useState<string>('');
  const [todoList, setTodoList] = useState<Tasks[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'task') {
      //console.log(event);
      setTask(event.target.value);
    }
  };

  const addTask = (): void => {
    const currDate = new Date();
    const newTask: Tasks = {
      taskName: task,
      taskId: Math.floor(Math.random() * 199000),
      taskState: 'incomplete',
      dateChanged: currDate
    };
    setTodoList([newTask, ...todoList]);
    setTask(''); // clear inputs
    const currSession: SessionInterface = readPomoHubData().storedSessions[readPomoHubData().storedSessions.length - 1];

    // if the current session has no cycles, create a new cycle with the new task
    if (currSession.cycleArray.length === 0) {
      const updatedSession = new PomoSessionHandler(currSession).cycleStart([newTask]);
      writeSessionToPomoHubData(updatedSession);
      //console.log('ADDED NEW CYCLE, then NEW TASK', updatedSession);
    } else {
      // if the current session has cycles, add the new task to the latest cycle
      // get latest cycle
      const latestCycle = currSession.cycleArray[currSession.cycleArray.length - 1];
      const updatedCycle = {
        ...latestCycle,
        tasks: [newTask, ...latestCycle.tasks]
      };

      const updatedSession = new PomoSessionHandler(currSession).updateExistingCycle(updatedCycle);
      writeSessionToPomoHubData(updatedSession);
      //console.log('ADDED TASK TO EXISTING CYCLE THIS WORKS', updatedSession);
      //console.log('LOCAL STORAGE THIS WORKS', readPomoHubData());
    }
  };


  // if the user presses the Enter key, add the task
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      addTask();
    }
  };
  // const handleEnter = (event: KeyboardEvent): void => {
  //   if (event.target.name === 'task' && event.key === 'Enter') {
  //     addTask();
  //   }
  // };

  const completeTask = (taskIdToComplete: number): void => {
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
    const currSession: SessionInterface = readPomoHubData().storedSessions[readPomoHubData().storedSessions.length - 1];

    const sessionHandler = new PomoSessionHandler(currSession);
    const updatedSession = sessionHandler.updateTaskStatusInCurrentCycle(taskIdToComplete, 'completed');

    writeSessionToPomoHubData(updatedSession);
  };

  const deleteTask = (taskIdToDelete: number): void => {
    const currSession: SessionInterface = readPomoHubData().storedSessions[readPomoHubData().storedSessions.length - 1];

    const sessionHandler = new PomoSessionHandler(currSession);
    const updatedSession = sessionHandler.updateTaskStatusInCurrentCycle(taskIdToDelete, 'deleted');
    writeSessionToPomoHubData(updatedSession);

    setTodoList(
      todoList.filter((task) => {
        return task.taskId !== taskIdToDelete;
      })
    );
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
      <div className="h-[250px] overflow-auto flex-col gap-2 scrollbar mb-12 ml-0.5">
        {todoList.map((task: Tasks, key: number) => {
          return (
            <div className="mb-3">
              <Task key={key} task={task} completeTask={completeTask} deleteTask={deleteTask} />
            </div>
          );
        })}
      </div>
      <div className=" h-60 w-[650px] backdrop-blur-lg absolute mt-[345px] -ml-10 pointer-events-none" />
    </div>
  );
}

export default TaskList;
function taskState(arg0: number, taskState: any, arg2: string) {
  throw new Error('Function not implemented.');
}
