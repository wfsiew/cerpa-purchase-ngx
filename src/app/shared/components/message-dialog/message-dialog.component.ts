import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppConstant } from '../../constants';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { InventoryService } from '../../../components/inventory/inventory.service';
@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})

export class MessageDialogComponent implements OnInit {
  myControl = new FormControl();
  id?: any;
  message: string;
  button_yes: string;
  button_no: string;
  title: string;

  options: Messages[] = [];
  filteredOptions: Observable<Messages[]>;

  readonly appConstant = AppConstant;
  constructor (
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.id = data.id;
    this.message = data.message;
    this.title = data.title;
    this.button_yes = data.button_yes;
    this.button_no = data.button_no;
  }

  ngOnInit() {
    this.loadReasons();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | Messages>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  loadReasons() {
    this.inventoryService.get_disposeReason().subscribe((res: Messages[]) => {
      this.options = res;
    });
  }

  private _filter(name: string): Messages[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit() {
    this.dialogRef.close({ message: this.myControl.value, id: this.id});
  }

}

export interface Messages {
  id: number;
  name: string;
}
