import { Component } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore"; // 튜토리얼 기준 변경 >> import { AngularFirestoreModule } from '@angular/fire/firestore';

import { Task } from './task/Task';
import { TaskDialogResult } from './task-dialog/TaskDialogResult';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'kanban-fire';

  todo//!: Observable<Task[]>; // 
    = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  inProgress//!: Observable<Task[]>; // 
    = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  done//!: Observable<Task[]>; // 
    = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

  // private todoCollection!: AngularFirestoreCollection<Task>;
  // private inProgressCollection!: AngularFirestoreCollection<Task>;
  // private doneCollection!: AngularFirestoreCollection<Task>;

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
  ) { }

  ngOnInit(): void {
    // this.todoCollection = this.store.collection<Task>('todo');
    // this.todo = this.todoCollection.valueChanges();

    // this.inProgressCollection = this.store.collection<Task>('inProgress');
    // this.inProgress = this.inProgressCollection.valueChanges();

    // this.doneCollection = this.store.collection<Task>('done');
    // this.done = this.doneCollection.valueChanges();
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      if (!result) {
        return;
      }
      // firestore 기준 코드 교체
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    // firestore 기준 코드 추가
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });

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
        // firestore 기준 코드 교체
        this.store.collection('todo').add(result.task);
      });
  }
}
