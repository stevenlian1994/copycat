import { NgModule } from '@angular/core';
import { MatButtonModule, MatSelectModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule } from "@angular/material";

const MaterialComponents = [
  MatButtonModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,

];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})

export class MaterialModule { }


