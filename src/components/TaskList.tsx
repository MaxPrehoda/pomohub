import React, { useEffect, ChangeEvent, useState } from 'react';
import Task from './Task';

function TaskList() {
  interface Tasks {
    taskName: string;
    taskId: number;
  }

  const [task, setTask] = useState<string>('');
  const [todoList, setTodoList] = useState<Tasks[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'task') {
      setTask(event.target.value);
    }
  };

  const addTask = (): void => {
    const newTask = { taskName: task, taskId: Math.floor(Math.random() * 199000)};
    setTodoList([...todoList, newTask]);
    setTask(''); // clear inputs
    console.log(newTask)
  };

  const completeTask = (taskIdToComplete: number): void => {
    // send task to storage
    console.log(`Task completed: ${taskIdToComplete}`);
    setTodoList(
      todoList.filter((task) => {
        return task.taskId !== taskIdToComplete;
      })
    );
  };

  const deleteTask = (taskIdToDelete: number): void => {
    setTodoList(
      todoList.filter((task) => {
        return task.taskId !== taskIdToDelete;
      })
    );
  };

  return (
    <div className="flex flex-col w-2/6 lg:w-[440px] gap-3 text-white font-medium">
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
