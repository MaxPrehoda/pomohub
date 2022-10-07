import React, { useEffect, useState } from 'react';

function TaskList() {
    interface ITask {
        taskName: string;
        deadline: number;
    }

    const [task, setTask] = useState<string>("");
    const [deadline, setDealine] = useState<number>(0);
    const [todoList, setTodoList] = useState<ITask[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.name === "task") {
            setTask(event.target.value);
        } else {
            setDealine(Number(event.target.value));
        }
    };

    const addTask = (): void => {
        const newTask = { taskName: task, deadline: deadline };
        setTodoList([...todoList, newTask]);
        setTask("");
        setDealine(0);
    };

    const completeTask = (taskNameToDelete: string): void => {
        setTodoList(
            todoList.filter((task) => {
                return task.taskName != taskNameToDelete;
            })
        );
    };


    return (
        <div className='flex flex-col w-2/6 lg:w-[440px] gap-3 text-white font-medium'>
            <span className=''><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline w-8 h-8 pb-1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
                <h1 className="text-2xl inline text-white pl-1">Tasks</h1></span>
            <div className='bg-zinc-700 p-2 rounded-md text-left hover:opacity-60'><input className='mr-1' type="checkbox"></input> Take out trash</div>
            <div className='bg-zinc-700 p-2 rounded-md text-left hover:opacity-60'><input className='mr-2' type="checkbox"></input>Mock up text</div>
            <div className='bg-zinc-700 p-2 rounded-md text-left hover:opacity-60'><input className='mr-2' type="checkbox"></input>More of that</div>
            <div className='bg-zinc-700 p-2 rounded-md text-left hover:opacity-60'><input className='mr-2' type="checkbox"></input>And even more</div>
            <div className='bg-transparent p-2 rounded-md text-center hover:opacity-60 border-2 border-zinc-700'>
                <input className='bg-transparent' placeholder='Task Name'></input><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline w-6 h-6 pr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg><button onClick={addTask}>Add Task</button></div>
        </div>
    );
}

export default TaskList;


