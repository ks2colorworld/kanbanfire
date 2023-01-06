import { Component } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { Task } from './task/Task';
import { TaskDialogResult } from './task-dialog/TaskDialogResult';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private dialog: MatDialog
  ) { }

  title = 'kanban-fire';

  todo: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and by milk'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular create a Kanban app!'
    }
  ];

  inProgress: Task[] = [];
  done: Task[] = [];

  editTask(list: string, task: Task): void {
    /*
    주의: 동일한 구획에서 작업을 재정렬하는 경우 이를 처리하지 않습니다.
    편의상 Codelab에서는 이 기능을 생략하지만 CDK 문서를 사용하여 직접 구현해도 됩니다.
    문서 : https://material.angular.io/cdk/drag-drop/overview
     */
  }

  drop(event: CdkDragDrop<Task[]>): void {   // 튜토리얼 소스 (오류!) >> CdkDragDrop<Task[]|null> / https://developers.google.com/codelabs/building-a-web-app-with-angular-and-firebase#4
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }
}
