import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DevExtremeModule,
         DxDataGridModule,
         DxTemplateModule,
         DxChartModule,
         DxDateBoxModule,
         DxSelectBoxModule } from 'devextreme-angular';
import { StocksInfoComponent } from './stocks-info.component';

const routes: Routes = [
  {
    path: '',
    component: StocksInfoComponent
  }
]

@NgModule({
  declarations: [
    StocksInfoComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule,
    DxDataGridModule,
    DxTemplateModule,
    DxChartModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class StocksInfoModule { }
