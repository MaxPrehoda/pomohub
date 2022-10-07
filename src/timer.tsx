/*
   Name: timerInit
   Usage: Determines the current end date and the time from the current start Date

 */
function endTime(settings: TimeDuration) {
  // initialize two date (1 reference, 1 to modify )
  const currDate = new Date();
  let endDate = new Date(currDate.setHours(currDate.getHours() + settings.hr));
  endDate = new Date(endDate.setMinutes(currDate.getMinutes() + settings.min));
  endDate = new Date(endDate.setSeconds(currDate.getSeconds() + settings.sec));
  return [currDate, endDate];
}

/*
   Name: timeStamp
   Usage: Updates the current Time parameter of the object (current WIP)
   Unknowns: what actions are being recorded, what data is needed (name of item, contents, time)?
   Parameters: item action (name, contents I presume) and session number to have a unique item in local storage
   */

/*
function timeStamp(item: unknown, sessionKey: string) {
  const currLog = window.localStorage.getItem(`${sessionKey}timeLog`);
  const currTime = new Date();
  let action = {
      "actionType": item.actionName,
      "contents": item.contents,
      "executed": currTime
}
  if (currLog == null) {

    continue;
  }
  return null;
}
*/

type TimeDuration = {
  hr: number;
  min: number;
  sec: number;
  msec: number;
};

export { endTime };
export type { TimeDuration };
