import React from "react";

interface Tasks {
    taskName: string;
}

interface Props {
    task: Tasks;
    completeTask(taskNameToDelete: string): void;
}

const Task = ({ task, completeTask }: Props) => {
    return (
        <div className="flex task bg-zinc-700 p-2 rounded-md text-left hover:opacity-60">
            <input className='mr-1' type="checkbox"></input>
            <div className="content">
                <span>{task.taskName}</span>
            </div>
            <button className="ml-8"
                onClick={() => {
                    completeTask(task.taskName);
                }}
            >
                X
            </button>
        </div>
    );
};

export default Task;