import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

// ✅ Standalone components - import, NOT declare
import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';

@NgModule({

    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        DragDropModule,
        AppComponent,
        EmployeesComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
