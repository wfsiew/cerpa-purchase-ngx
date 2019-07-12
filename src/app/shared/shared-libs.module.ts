import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QRCodeModule } from 'angularx-qrcode';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatRippleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatListModule,
  MatCardModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatChipsModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  MatProgressBarModule,
  MatSortModule,
  MatRadioModule,

} from '@angular/material';
import { PipeModule } from './pipe/pip.PipeModule';

@NgModule({
    imports: [],
    exports: [
      PdfViewerModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatCheckboxModule,
      MatGridListModule,
      MatListModule,
      MatCardModule,
      MatMenuModule,
      MatPaginatorModule,
      MatSnackBarModule,
      MatExpansionModule,
      MatChipsModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MatAutocompleteModule,
      MatToolbarModule,
      MatTooltipModule,
      MatInputModule,
      MatInputModule,
      MatDialogModule,
      MatGridListModule,
      MatFormFieldModule,
      MatIconModule,
      MatSelectModule,
      MatButtonModule,
      MatListModule,
      MatPaginatorModule,
      MatMenuModule,
      MatCheckboxModule,
      MatTooltipModule,
      MatTableModule,
      MatProgressBarModule,
      MatSortModule,
      MatRadioModule,
      MatRippleModule,
      PipeModule,
      MatDatepickerModule,
      MatNativeDateModule,
      QRCodeModule
    ]
})
export class SharedLibsModule {}
