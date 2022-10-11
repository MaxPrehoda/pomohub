import React from 'react';
import { readPomoHubData } from '../App';
import { PomoHubLocalStorageInterface } from '../entities';

// type TaskTimeSummary = [string, string][];

// export interface CycleData {
//   tasks: Array<Tasks>;
//   cycleStart: Date | null;
//   cycleEnd: Date | null;
//   cycleSecDur: number | null;
// }

// export interface Tasks {
//   taskName: string;
//   taskId: number;
//   taskState: string;
//   dateChanged: Date;
// }

// const mockTasks: Tasks[] = [
//   {
//     taskName: 'task1',
//     taskId: 1,
//     taskState: 'completed',
//     dateChanged: new Date('2021-01-01')
//   },
//   {
//     taskName: 'task2',
//     taskId: 2,
//     taskState: 'completed',
//     dateChanged: new Date('2021-01-01')
//   }
// ];

// const mockCycleData: CycleData = {
//   tasks: mockTasks,
//   cycleStart: new Date(),
//   cycleEnd: new Date(),
//   cycleSecDur: 0
// };

// const yesterday = new Date();
// yesterday.setDate(yesterday.getDate() - 1);

// const dayBeforeYesterday = new Date();
// dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

// const todayAt10AM = new Date();
// todayAt10AM.setHours(10, 0, 0, 0);

// const mockPomoHubData: PomoHubLocalStorageInterface = {
//   userName: 'test',
//   storedSessions: [
//     {
//       startingDateTime: dayBeforeYesterday,
//       numberOfCyclesCompleted: 0,
//       cycleArray: [mockCycleData, mockCycleData],
//       expectedCycleArray: [mockCycleData, mockCycleData],
//       isRunning: false,
//       endingDateTime: yesterday
//     },
//     {
//       startingDateTime: todayAt10AM,
//       numberOfCyclesCompleted: 1,
//       cycleArray: [mockCycleData, mockCycleData],
//       expectedCycleArray: [mockCycleData, mockCycleData],
//       isRunning: false,
//       endingDateTime: null
//     }
//   ]
// };
// const exportTaskTimeSummary = () => {
//   const pomoHubData = mockPomoHubData; // readPomoHubData();

// //   const taskTimeSummary: TaskTimeSummary = pomoHubData.storedSessions.map((storedSession) => {
// //     return storedSession.cycleArray.map((cycle) => {
// //       return cycle.tasks.map((task) => {
// //         if (task.taskState === 'incomplete') {
// //           return [task.taskName, 'incomplete'];
// //         }
// //         return [task.taskName, 'incomplete'];
// //       });
// //     });
// //   });

// //   if (Object.keys(taskTimeSummary).length === 0) {
// //     //console.log('No task time summary to export');
// //     return JSON.stringify([]);
// //   }

// //   const taskTimeSummaryString = JSON.stringify(taskTimeSummary);
//   return taskTimeSummaryString;
// };

// function ExportTaskTimeSummaryButton() {
//   const data = exportTaskTimeSummary();
//   const blob = new Blob([data], { type: 'application/json' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.download = 'task-time-summary.json';
//   link.href = url;
//   link.click();

//   const isButtonDisabled = Object.keys(data).length === 0;
//   return (
//     <button
//       className="bg-purple-400 rounded-md pl-2 mr-2 pr-2 pt-2 pb-2 disabled:opacity-50"
//       onClick={exportTaskTimeSummary}
//       disabled={isButtonDisabled}
//     >
//       Export Task Time Summary
//     </button>
//   );
// }

// export default ExportTaskTimeSummaryButton;
