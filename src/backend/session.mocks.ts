
import {Tasks} from '../entities';


export const mockOneTask: Tasks[] = [
    {
      taskName: 'mock task 1',
      taskId: 1,
      taskState: 'incomplete',
      dateChanged: new Date()
    }
  ];

export const mockTwoTasks: Tasks[] = [
    {
      taskName: 'mock task 1',
      taskId: 1,
      taskState: 'incomplete',
      dateChanged: new Date()
    },
    {
      taskName: 'mock task 2',
      taskId: 2,
      taskState: 'incomplete',
      dateChanged: new Date()
    }
  ];
