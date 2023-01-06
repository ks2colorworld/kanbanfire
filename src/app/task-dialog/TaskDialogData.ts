import { Task } from './../task/Task';

export interface TaskDialogData {
  task: Partial<Task>;
  enableDelete: boolean;
}
