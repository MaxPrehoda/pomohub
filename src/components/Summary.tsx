import React from 'react';
import TaskList from './TaskList';

function Summary() {
  return (
    <section class="bg-white dark:bg-neutral-900">
  <div class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
        Work Summary
      </h2>

      <p class="mt-4 text-neutral-500 dark:text-neutral-400 sm:text-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores
        laborum labore provident impedit esse recusandae facere libero harum
        sequi.
      </p>
    </div>

    <div class="mt-8 sm:mt-12">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          class="flex flex-col rounded-lg border border-neutral-100 px-4 py-8 text-center dark:border-neutral-800"
        >
          <dt
            class="order-last text-lg font-medium text-neutral-500 dark:text-neutral-400"
          >
            Total Time Elapsed (Minutes)
          </dt>

          <dd class="text-4xl font-extrabold text-blue-400 md:text-5xl">
            127
          </dd>
        </div>

        <div
          class="flex flex-col rounded-lg border border-neutral-100 px-4 py-8 text-center dark:border-neutral-800"
        >
          <dt
            class="order-last text-lg font-medium text-neutral-500 dark:text-neutral-400"
          >
            Total Tasks Completed
          </dt>

          <dd class="text-4xl font-extrabold text-green-400 md:text-5xl">24</dd>
        </div>

        <div
          class="flex flex-col rounded-lg border border-neutral-100 px-4 py-8 text-center dark:border-neutral-800"
        >
          <dt
            class="order-last text-lg font-medium text-neutral-500 dark:text-neutral-400"
          >
            Total Tasks Deleted
          </dt>

          <dd class="text-4xl font-extrabold text-red-400 md:text-5xl">6</dd>
        </div>
      </dl>
    </div>
    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-4xl mt-12">Tasks</h1>
    <div className="h-[250px] overflow-auto flex-col gap-2 scrollbar mb-12 ml-0.5">
        {/*todoList
          .filter((task) => {
            if (task) {
            return task.taskState !== 'complete' && task.taskState !== 'deleted';}
          })
          .map((task: Tasks, key: number) => {
            return (
              <div className="mb-3">
                <Task key={key} task={task} completeTask={completeTask} deleteTask={deleteTask} />
              </div>
            );
          })*/}
      </div>
  </div>
</section>

  );
}

export default Summary;
